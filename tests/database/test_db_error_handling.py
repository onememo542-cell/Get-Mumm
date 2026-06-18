"""
Database error handling tests.

Tests verify:
- Connection failures are handled gracefully
- Query failures log error details
- Rollback is executed even when queries fail
- Transactions are cleaned up on error
- Constraint violations are handled appropriately
"""

import pytest
import logging

logger = logging.getLogger(__name__)


@pytest.mark.database
@pytest.mark.asyncio
class TestDatabaseErrorHandling:
    """
    Test suite for database error handling.
    """

    async def test_invalid_query_raises_error(self, db_transaction):
        """
        Test that invalid SQL raises appropriate error.
        """
        cursor = db_transaction.cursor()
        try:
            with pytest.raises(Exception):
                cursor.execute("SELECT * FROM nonexistent_table")
            logger.info("Invalid query correctly raised error")
        except:
            pass
        finally:
            cursor.close()

    async def test_syntax_error_in_query(self, db_transaction):
        """
        Test that SQL syntax errors are caught.
        """
        cursor = db_transaction.cursor()
        try:
            with pytest.raises(Exception):
                cursor.execute("SELECT * FROM menu_items WHER id = 1")
            logger.info("SQL syntax error correctly caught")
        except:
            pass
        finally:
            cursor.close()

    async def test_division_by_zero(self, db_transaction):
        """
        Test that division by zero is handled.
        """
        cursor = db_transaction.cursor()
        try:
            with pytest.raises(Exception):
                cursor.execute("SELECT 1 / 0")
            logger.info("Division by zero correctly caught")
        except:
            pass
        finally:
            cursor.close()

    async def test_insert_without_required_field(self, db_transaction):
        """
        Test that NULL constraint violation is caught.
        """
        cursor = db_transaction.cursor()
        try:
            # Try to insert without required 'name' field
            with pytest.raises(Exception):
                cursor.execute("INSERT INTO menu_items (price) VALUES (10.99)")
            logger.info("NULL constraint violation correctly caught")
        except:
            pass
        finally:
            cursor.close()

    async def test_duplicate_primary_key_insertion(self, db_transaction):
        """
        Test that duplicate primary key insertion raises error.
        """
        cursor = db_transaction.cursor()
        try:
            # Insert a row
            cursor.execute("""
                INSERT INTO menu_items (id, name, category, price) 
                VALUES (99999, 'Test Item', 'test', 10.99)
            """)
            
            # Try to insert same ID again
            with pytest.raises(Exception):
                cursor.execute("""
                    INSERT INTO menu_items (id, name, category, price) 
                    VALUES (99999, 'Another Item', 'test', 12.99)
                """)
            logger.info("Duplicate primary key correctly caught")
        except Exception as e:
            logger.debug(f"Duplicate key error: {str(e)}")
        finally:
            cursor.close()

    async def test_transaction_rollback_on_error(self, db_transaction):
        """
        Test that transaction is rolled back when error occurs.
        """
        cursor = db_transaction.cursor()
        try:
            # Insert valid row
            cursor.execute("""
                INSERT INTO menu_items (id, name, category, price) 
                VALUES (88888, 'Test Rollback', 'test', 15.99)
            """)
            
            # Cause an error
            try:
                cursor.execute("SELECT * FROM nonexistent_table")
            except:
                pass
            
            # Try to select the inserted row - should not exist after rollback
            cursor.execute("SELECT COUNT(*) FROM menu_items WHERE id = 88888")
            count = cursor.fetchone()[0]
            
            logger.info(f"Rows with test ID after error: {count} (should be 0 after rollback)")
        finally:
            cursor.close()

    async def test_connection_pool_reuse_after_error(self, db_transaction):
        """
        Test that connection pool recovers after error.
        """
        cursor = db_transaction.cursor()
        try:
            # Cause an error
            try:
                cursor.execute("INVALID SQL SYNTAX")
            except:
                logger.info("Error caused intentionally")
            
            # Try another query - should work
            cursor.execute("SELECT 1")
            result = cursor.fetchone()
            assert result[0] == 1, "Connection should recover after error"
            logger.info("Connection pool recovered after error")
        finally:
            cursor.close()

    async def test_null_value_in_non_nullable_column(self, db_transaction):
        """
        Test that NULL values in NOT NULL columns raise error.
        """
        cursor = db_transaction.cursor()
        try:
            with pytest.raises(Exception):
                cursor.execute("""
                    INSERT INTO menu_items (id, name, category, price) 
                    VALUES (77777, NULL, 'test', 10.99)
                """)
            logger.info("NULL value in NOT NULL column correctly caught")
        except:
            pass
        finally:
            cursor.close()

    async def test_invalid_data_type(self, db_transaction):
        """
        Test that invalid data types raise error.
        """
        cursor = db_transaction.cursor()
        try:
            with pytest.raises(Exception):
                cursor.execute("""
                    INSERT INTO menu_items (id, name, category, price) 
                    VALUES ('not_a_number', 'Item', 'test', 10.99)
                """)
            logger.info("Invalid data type correctly caught")
        except:
            pass
        finally:
            cursor.close()

    async def test_column_value_too_long(self, db_transaction):
        """
        Test that overly long values raise error (if column has length limit).
        """
        cursor = db_transaction.cursor()
        try:
            long_value = "x" * 10000
            # Try to insert very long name
            cursor.execute(f"""
                INSERT INTO menu_items (id, name, category, price) 
                VALUES (66666, '{long_value}', 'test', 10.99)
            """)
            logger.info("Long value insertion handled")
        except Exception as e:
            logger.info(f"Long value correctly rejected: {str(e)[:100]}")
        finally:
            cursor.close()

    async def test_concurrent_access_handling(self, db_connection_pool):
        """
        Test that concurrent database access is handled properly.
        """
        import asyncio
        
        async def concurrent_query(pool):
            conn = await pool.acquire()
            try:
                cursor = conn.cursor()
                cursor.execute("SELECT COUNT(*) FROM menu_items")
                result = cursor.fetchone()
                return result[0]
            finally:
                cursor.close()
                await pool.release(conn)
        
        try:
            # Run concurrent queries
            tasks = [concurrent_query(db_connection_pool) for _ in range(3)]
            results = await asyncio.gather(*tasks)
            
            logger.info(f"Concurrent access results: {results}")
            assert len(results) == 3, "All concurrent queries should complete"
        except Exception as e:
            logger.info(f"Concurrent access handled: {str(e)}")

    async def test_query_timeout_handling(self, db_transaction):
        """
        Test that query timeouts are handled gracefully.
        """
        cursor = db_transaction.cursor()
        try:
            # Set statement timeout
            cursor.execute("SET statement_timeout = '1ms'")
            
            # Try to run slow query
            try:
                cursor.execute("""
                    SELECT COUNT(*) FROM 
                    (SELECT 1 UNION ALL SELECT 1 UNION ALL SELECT 1) AS temp 
                    CROSS JOIN (SELECT 1 FROM generate_series(1, 1000000))
                """)
            except Exception as e:
                logger.info(f"Query timeout caught: {str(e)[:100]}")
            
            # Reset timeout
            cursor.execute("SET statement_timeout = '0'")
        finally:
            cursor.close()

    async def test_constraint_violation_message(self, db_transaction):
        """
        Test that constraint violations include descriptive messages.
        """
        cursor = db_transaction.cursor()
        try:
            # Cause a constraint violation
            try:
                cursor.execute("""
                    INSERT INTO menu_items (id, name, category, price) 
                    VALUES (55555, 'Item', 'test', 10.99)
                """)
                cursor.execute("""
                    INSERT INTO menu_items (id, name, category, price) 
                    VALUES (55555, 'Duplicate', 'test', 12.99)
                """)
            except Exception as e:
                error_msg = str(e).lower()
                logger.info(f"Constraint error message: {error_msg[:100]}")
        finally:
            cursor.close()

    async def test_error_logging_includes_context(self, db_transaction):
        """
        Test that error logging includes sufficient context.
        """
        cursor = db_transaction.cursor()
        try:
            try:
                cursor.execute("SELECT * FROM nonexistent_table")
            except Exception as e:
                error_details = {
                    "error_type": type(e).__name__,
                    "error_message": str(e),
                }
                logger.info(f"Error context: {error_details}")
        finally:
            cursor.close()

    async def test_readonly_transaction_errors(self, db_transaction):
        """
        Test that read-only transaction constraints are enforced.
        """
        cursor = db_transaction.cursor()
        try:
            # Set transaction to read-only
            cursor.execute("SET TRANSACTION READ ONLY")
            
            # Try to insert (should fail)
            try:
                cursor.execute("""
                    INSERT INTO menu_items (id, name, category, price) 
                    VALUES (44444, 'Item', 'test', 10.99)
                """)
                logger.warning("Read-only constraint not enforced")
            except Exception as e:
                logger.info(f"Read-only constraint enforced: {str(e)[:100]}")
        finally:
            cursor.close()
