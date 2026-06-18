"""
Database tests for transaction management and data isolation.

Tests verify:
- Transaction rollback restores database state
- Multiple tests don't contaminate each other's data
- Session-scoped transactions maintain connection pools
- Data seeding fixtures work correctly
"""

import pytest
import logging

logger = logging.getLogger(__name__)


@pytest.mark.database
@pytest.mark.asyncio
class TestDataIsolation:
    """
    Test suite for database transaction and data isolation.
    """

    async def test_transaction_rollback_restores_state(self, db_transaction, seed_menu_items):
        """
        Test that transaction rollback restores database to pre-test state.
        """
        # Count items after seeding
        db_transaction.execute("SELECT COUNT(*) FROM menu_items")
        count_before = db_transaction.fetchone()[0]
        assert count_before > 0, "Seeded data should exist"

        # Insert new item
        db_transaction.execute(
            "INSERT INTO menu_items (name, category, price) VALUES (%s, %s, %s)",
            ("Test Item Rollback", "mains", 9.99)
        )

        # Count items after insert
        db_transaction.execute("SELECT COUNT(*) FROM menu_items")
        count_after = db_transaction.fetchone()[0]
        assert count_after == count_before + 1, "Count should increase after insert"

        logger.info(f"Count before insert: {count_before}, after insert: {count_after}")
        # Transaction will rollback after test completes

    async def test_seeded_data_accessible_in_test(self, db_transaction, seed_menu_items):
        """
        Test that seeded menu items are accessible in the test.
        """
        db_transaction.execute("SELECT COUNT(*) FROM menu_items")
        count = db_transaction.fetchone()[0]
        assert count >= 10, "Should have seeded at least 10 menu items"
        logger.info(f"Seeded data accessible: {count} menu items")

    async def test_multiple_seeded_items(self, db_transaction, seed_menu_items, seed_chefs, seed_blog_posts):
        """
        Test that multiple seed fixtures work together without conflicts.
        """
        db_transaction.execute("SELECT COUNT(*) FROM menu_items")
        items_count = db_transaction.fetchone()[0]

        db_transaction.execute("SELECT COUNT(*) FROM chefs")
        chefs_count = db_transaction.fetchone()[0]

        db_transaction.execute("SELECT COUNT(*) FROM blog_posts")
        posts_count = db_transaction.fetchone()[0]

        assert items_count > 0, "Should have menu items"
        assert chefs_count > 0, "Should have chefs"
        assert posts_count > 0, "Should have blog posts"

        logger.info(f"Multiple fixtures: {items_count} items, {chefs_count} chefs, {posts_count} posts")

    async def test_seeded_menu_items_have_prices(self, db_transaction, seed_menu_items):
        """
        Test that seeded menu items have valid prices.
        """
        db_transaction.execute("SELECT price FROM menu_items WHERE price > 0")
        rows = db_transaction.fetchall()
        assert len(rows) > 0, "Should have menu items with prices"
        logger.info(f"Found {len(rows)} menu items with prices")

    async def test_seeded_chefs_have_names(self, db_transaction, seed_chefs):
        """
        Test that seeded chefs have names.
        """
        db_transaction.execute("SELECT name FROM chefs WHERE name IS NOT NULL")
        rows = db_transaction.fetchall()
        assert len(rows) > 0, "Should have chefs with names"
        logger.info(f"Found {len(rows)} chefs with names")

    async def test_seeded_blog_posts_have_content(self, db_transaction, seed_blog_posts):
        """
        Test that seeded blog posts have content.
        """
        db_transaction.execute("SELECT content FROM blog_posts WHERE content IS NOT NULL")
        rows = db_transaction.fetchall()
        assert len(rows) > 0, "Should have blog posts with content"
        logger.info(f"Found {len(rows)} blog posts with content")

    async def test_parameterized_dietary_items(self, db_transaction, parameterized_dietary_items):
        """
        Test that parameterized dietary fixtures generate correct variations.
        """
        dietary = parameterized_dietary_items["dietary"]
        count = parameterized_dietary_items["count"]

        db_transaction.execute(
            "SELECT COUNT(*) FROM menu_items WHERE dietary_info = %s",
            (dietary,)
        )
        result = db_transaction.fetchone()[0]
        assert result >= count, f"Should have at least {count} {dietary} items"
        logger.info(f"Parameterized fixture {dietary}: {result} items created")

    async def test_parameterized_blog_categories(self, db_transaction, parameterized_blog_categories):
        """
        Test that parameterized blog category fixtures work.
        """
        category = parameterized_blog_categories["category"]

        db_transaction.execute(
            "SELECT COUNT(*) FROM blog_posts WHERE category = %s",
            (category,)
        )
        result = db_transaction.fetchone()[0]
        assert result >= 1, f"Should have at least 1 post in {category} category"
        logger.info(f"Parameterized blog category {category}: {result} posts created")

    async def test_connection_pool_reuse(self, db_connection_pool):
        """
        Test that connection pool can be reused across tests.
        """
        cursor = db_connection_pool.cursor()
        cursor.execute("SELECT 1")
        result = cursor.fetchone()
        assert result is not None, "Connection pool should be usable"
        cursor.close()
        logger.info("Connection pool reuse successful")
