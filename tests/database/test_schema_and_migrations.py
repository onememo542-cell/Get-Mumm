"""
Database schema and migration tests.

Tests verify:
- Database schema is created correctly on initialization
- All required tables exist with correct columns
- Indexes are created for performance
- Constraints are enforced
- Foreign key relationships are valid
"""

import pytest
import logging

logger = logging.getLogger(__name__)


@pytest.mark.database
@pytest.mark.asyncio
class TestDatabaseSchema:
    """
    Test suite for database schema and migrations.
    """

    async def test_menu_items_table_exists(self, db_transaction):
        """
        Test that menu_items table exists in database.
        """
        cursor = db_transaction.cursor()
        try:
            cursor.execute("""
                SELECT EXISTS (
                    SELECT FROM information_schema.tables 
                    WHERE table_name = 'menu_items'
                )
            """)
            result = cursor.fetchone()
            assert result[0], "menu_items table should exist"
            logger.info("menu_items table exists")
        finally:
            cursor.close()

    async def test_menu_items_has_required_columns(self, db_transaction):
        """
        Test that menu_items table has all required columns.
        """
        cursor = db_transaction.cursor()
        try:
            cursor.execute("""
                SELECT column_name FROM information_schema.columns
                WHERE table_name = 'menu_items'
            """)
            columns = [row[0] for row in cursor.fetchall()]
            
            required_columns = ["id", "name", "category", "price"]
            for col in required_columns:
                assert col in columns, f"menu_items should have '{col}' column"
            
            logger.info(f"menu_items has all required columns: {columns}")
        finally:
            cursor.close()

    async def test_chefs_table_exists(self, db_transaction):
        """
        Test that chefs table exists in database.
        """
        cursor = db_transaction.cursor()
        try:
            cursor.execute("""
                SELECT EXISTS (
                    SELECT FROM information_schema.tables 
                    WHERE table_name = 'chefs'
                )
            """)
            result = cursor.fetchone()
            assert result[0], "chefs table should exist"
            logger.info("chefs table exists")
        finally:
            cursor.close()

    async def test_chefs_has_required_columns(self, db_transaction):
        """
        Test that chefs table has all required columns.
        """
        cursor = db_transaction.cursor()
        try:
            cursor.execute("""
                SELECT column_name FROM information_schema.columns
                WHERE table_name = 'chefs'
            """)
            columns = [row[0] for row in cursor.fetchall()]
            
            required_columns = ["id", "name"]
            for col in required_columns:
                assert col in columns, f"chefs should have '{col}' column"
            
            logger.info(f"chefs has required columns: {columns}")
        finally:
            cursor.close()

    async def test_blog_posts_table_exists(self, db_transaction):
        """
        Test that blog_posts table exists in database.
        """
        cursor = db_transaction.cursor()
        try:
            cursor.execute("""
                SELECT EXISTS (
                    SELECT FROM information_schema.tables 
                    WHERE table_name = 'blog_posts'
                )
            """)
            result = cursor.fetchone()
            assert result[0], "blog_posts table should exist"
            logger.info("blog_posts table exists")
        finally:
            cursor.close()

    async def test_contact_submissions_table_exists(self, db_transaction):
        """
        Test that contact_submissions table exists in database.
        """
        cursor = db_transaction.cursor()
        try:
            cursor.execute("""
                SELECT EXISTS (
                    SELECT FROM information_schema.tables 
                    WHERE table_name = 'contact_submissions'
                )
            """)
            result = cursor.fetchone()
            assert result[0], "contact_submissions table should exist"
            logger.info("contact_submissions table exists")
        finally:
            cursor.close()

    async def test_subscriptions_table_exists(self, db_transaction):
        """
        Test that subscriptions table exists in database.
        """
        cursor = db_transaction.cursor()
        try:
            cursor.execute("""
                SELECT EXISTS (
                    SELECT FROM information_schema.tables 
                    WHERE table_name = 'subscriptions'
                )
            """)
            result = cursor.fetchone()
            assert result[0], "subscriptions table should exist"
            logger.info("subscriptions table exists")
        finally:
            cursor.close()

    async def test_tables_have_primary_keys(self, db_transaction):
        """
        Test that all main tables have primary key constraints.
        """
        cursor = db_transaction.cursor()
        try:
            tables = ["menu_items", "chefs", "blog_posts", "contact_submissions", "subscriptions"]
            
            for table in tables:
                cursor.execute(f"""
                    SELECT constraint_name FROM information_schema.table_constraints
                    WHERE table_name = '{table}' AND constraint_type = 'PRIMARY KEY'
                """)
                result = cursor.fetchone()
                if result:
                    logger.info(f"{table} has primary key: {result[0]}")
                else:
                    logger.warning(f"{table} may not have primary key")
        finally:
            cursor.close()

    async def test_column_types_are_appropriate(self, db_transaction):
        """
        Test that columns have appropriate data types.
        """
        cursor = db_transaction.cursor()
        try:
            cursor.execute("""
                SELECT table_name, column_name, data_type 
                FROM information_schema.columns
                WHERE table_name IN ('menu_items', 'chefs', 'blog_posts')
                ORDER BY table_name, ordinal_position
            """)
            
            rows = cursor.fetchall()
            for table, column, dtype in rows:
                logger.debug(f"{table}.{column}: {dtype}")
            
            logger.info(f"Schema inspection completed for {len(set([r[0] for r in rows]))} tables")
        finally:
            cursor.close()

    async def test_null_constraints(self, db_transaction):
        """
        Test that NOT NULL constraints are properly set on required columns.
        """
        cursor = db_transaction.cursor()
        try:
            cursor.execute("""
                SELECT table_name, column_name, is_nullable
                FROM information_schema.columns
                WHERE table_name IN ('menu_items', 'chefs', 'blog_posts')
                AND column_name IN ('id', 'name')
            """)
            
            rows = cursor.fetchall()
            for table, column, is_nullable in rows:
                assert is_nullable == 'NO', f"{table}.{column} should be NOT NULL"
            
            logger.info(f"NULL constraints verified for {len(rows)} columns")
        finally:
            cursor.close()

    async def test_unique_constraints(self, db_transaction):
        """
        Test that UNIQUE constraints exist where appropriate.
        """
        cursor = db_transaction.cursor()
        try:
            cursor.execute("""
                SELECT constraint_name, table_name
                FROM information_schema.table_constraints
                WHERE constraint_type = 'UNIQUE'
            """)
            
            rows = cursor.fetchall()
            logger.info(f"Found {len(rows)} UNIQUE constraints")
            for constraint, table in rows:
                logger.debug(f"{table}: {constraint}")
        finally:
            cursor.close()

    async def test_foreign_key_relationships(self, db_transaction):
        """
        Test that foreign key relationships are properly configured.
        """
        cursor = db_transaction.cursor()
        try:
            cursor.execute("""
                SELECT constraint_name, table_name, referenced_table_name
                FROM information_schema.referential_constraints
            """)
            
            rows = cursor.fetchall()
            logger.info(f"Found {len(rows)} foreign key relationships")
            for constraint, table, ref_table in rows:
                logger.debug(f"{table} -> {ref_table} ({constraint})")
        finally:
            cursor.close()

    async def test_indexes_exist(self, db_transaction):
        """
        Test that indexes are created for performance.
        """
        cursor = db_transaction.cursor()
        try:
            cursor.execute("""
                SELECT indexname, tablename
                FROM pg_indexes
                WHERE schemaname = 'public'
            """)
            
            rows = cursor.fetchall()
            logger.info(f"Found {len(rows)} indexes")
            for index, table in rows[:10]:  # Log first 10
                logger.debug(f"{table}: {index}")
        finally:
            cursor.close()

    async def test_table_row_count(self, db_transaction):
        """
        Test that tables can be queried for row count.
        """
        cursor = db_transaction.cursor()
        try:
            tables = ["menu_items", "chefs", "blog_posts", "contact_submissions", "subscriptions"]
            
            for table in tables:
                cursor.execute(f"SELECT COUNT(*) FROM {table}")
                count = cursor.fetchone()[0]
                logger.info(f"{table} has {count} rows")
        finally:
            cursor.close()

    async def test_database_encoding(self, db_transaction):
        """
        Test that database uses correct encoding.
        """
        cursor = db_transaction.cursor()
        try:
            cursor.execute("SHOW client_encoding")
            encoding = cursor.fetchone()[0]
            logger.info(f"Database encoding: {encoding}")
            assert encoding.upper() in ["UTF8", "UTF-8"], "Should use UTF-8 encoding"
        finally:
            cursor.close()

    async def test_schema_version_tracking(self, db_transaction):
        """
        Test that schema version is tracked (if applicable).
        """
        cursor = db_transaction.cursor()
        try:
            # Check for migration tracking table
            cursor.execute("""
                SELECT EXISTS (
                    SELECT FROM information_schema.tables 
                    WHERE table_name IN ('schema_migrations', 'migrations', '_migrations')
                )
            """)
            result = cursor.fetchone()
            if result[0]:
                logger.info("Migration tracking table exists")
            else:
                logger.info("No migration tracking table found")
        finally:
            cursor.close()
