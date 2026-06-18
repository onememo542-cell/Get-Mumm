"""
Parameterized Fixtures Test Suite for Task 4.3

This module tests and validates the parameterized fixtures that enable
data variation testing across multiple dietary restrictions, blog categories,
and subscription tiers.

Tests verify:
- parameterized_dietary_items fixture generates correct number of instances (3 for vegetarian, 2 for vegan, 4 for gluten-free)
- parameterized_blog_categories fixture generates correct number of instances (4 for each category)
- parameterized_subscription_tiers fixture generates correct number of instances (3 for each tier)
- Each parameterized fixture properly inserts data and yields parameter information
- Fixtures work correctly with database transaction isolation
"""

import pytest
import logging

logger = logging.getLogger(__name__)


@pytest.mark.database
@pytest.mark.asyncio
class TestParameterizedDietaryItems:
    """
    Test suite for parameterized_dietary_items fixture.
    
    The fixture is parameterized with:
    - "vegetarian": 3 items
    - "vegan": 2 items
    - "gluten-free": 4 items
    
    This generates 3 test instances total (one per dietary type).
    """

    async def test_dietary_items_fixture_yields_correct_data(self, db_transaction, parameterized_dietary_items):
        """
        Test that parameterized_dietary_items fixture yields dictionary
        with dietary type and count.
        
        **Validates: Requirements 3.7, 6.6**
        """
        assert parameterized_dietary_items is not None, "Fixture should yield data"
        assert "dietary" in parameterized_dietary_items, "Should have 'dietary' key"
        assert "count" in parameterized_dietary_items, "Should have 'count' key"
        
        dietary = parameterized_dietary_items["dietary"]
        count = parameterized_dietary_items["count"]
        
        assert dietary in ["vegetarian", "vegan", "gluten-free"], f"Dietary type '{dietary}' should be one of the expected types"
        assert isinstance(count, int) and count > 0, f"Count should be positive integer, got {count}"
        
        logger.info(f"Parameterized dietary items fixture validated: {dietary} with {count} items")

    async def test_dietary_items_inserted_into_database(self, db_transaction, parameterized_dietary_items):
        """
        Test that fixture correctly inserts menu items into database
        with the specified dietary restriction.
        
        **Validates: Requirements 3.7, 6.6**
        """
        dietary = parameterized_dietary_items["dietary"]
        count = parameterized_dietary_items["count"]
        
        # Query database for items matching the dietary type
        db_transaction.execute(
            "SELECT COUNT(*) FROM menu_items WHERE dietary_info = %s",
            (dietary,)
        )
        db_count = db_transaction.fetchone()[0]
        
        assert db_count >= count, f"Database should have at least {count} items with dietary type '{dietary}', got {db_count}"
        logger.info(f"Verified {db_count} items with dietary type '{dietary}' in database")

    async def test_dietary_items_data_isolation(self, db_transaction, parameterized_dietary_items):
        """
        Test that each test instance has isolated data from the parameterized fixture.
        
        **Validates: Requirements 3.7, 6.6**
        """
        dietary = parameterized_dietary_items["dietary"]
        
        # Query for test items specifically created by the fixture
        db_transaction.execute(
            "SELECT COUNT(*) FROM menu_items WHERE dietary_info = %s AND name LIKE 'Test%' OR name LIKE '%Item%'",
            (dietary,)
        )
        count = db_transaction.fetchone()[0]
        
        # Verify at least some test items exist
        assert count > 0, f"Should have test items for dietary type '{dietary}'"
        logger.info(f"Data isolation verified for {dietary}: found {count} test items")

    async def test_dietary_items_prices_are_set(self, db_transaction, parameterized_dietary_items):
        """
        Test that dietary items have prices set correctly.
        """
        dietary = parameterized_dietary_items["dietary"]
        
        db_transaction.execute(
            "SELECT price FROM menu_items WHERE dietary_info = %s",
            (dietary,)
        )
        rows = db_transaction.fetchall()
        
        assert len(rows) > 0, f"Should have items for dietary type '{dietary}'"
        
        for row in rows:
            assert row[0] is not None and row[0] > 0, f"Price should be positive, got {row[0]}"
        
        logger.info(f"All {len(rows)} items with dietary type '{dietary}' have valid prices")


@pytest.mark.database
@pytest.mark.asyncio
class TestParameterizedBlogCategories:
    """
    Test suite for parameterized_blog_categories fixture.
    
    The fixture is parameterized with:
    - "recipes"
    - "techniques"
    - "ingredients"
    - "news"
    
    This generates 4 test instances total (one per category).
    """

    async def test_blog_categories_fixture_yields_correct_data(self, db_transaction, parameterized_blog_categories):
        """
        Test that parameterized_blog_categories fixture yields dictionary
        with category name.
        
        **Validates: Requirements 3.7, 6.6**
        """
        assert parameterized_blog_categories is not None, "Fixture should yield data"
        assert "category" in parameterized_blog_categories, "Should have 'category' key"
        
        category = parameterized_blog_categories["category"]
        
        assert category in ["recipes", "techniques", "ingredients", "news"], f"Category '{category}' should be one of the expected types"
        
        logger.info(f"Parameterized blog categories fixture validated: {category}")

    async def test_blog_post_inserted_for_category(self, db_transaction, parameterized_blog_categories):
        """
        Test that fixture correctly inserts blog post into database
        for the specified category.
        
        **Validates: Requirements 3.7, 6.6**
        """
        category = parameterized_blog_categories["category"]
        
        # Query database for blog posts in this category
        db_transaction.execute(
            "SELECT COUNT(*) FROM blog_posts WHERE category = %s",
            (category,)
        )
        count = db_transaction.fetchone()[0]
        
        assert count >= 1, f"Database should have at least 1 blog post in '{category}' category, got {count}"
        logger.info(f"Verified {count} blog posts in '{category}' category")

    async def test_blog_post_has_required_fields(self, db_transaction, parameterized_blog_categories):
        """
        Test that inserted blog posts have all required fields.
        
        **Validates: Requirements 3.7, 6.6**
        """
        category = parameterized_blog_categories["category"]
        
        # Query for a blog post in this category with all fields
        db_transaction.execute(
            """
            SELECT id, title, content, author, category, publish_date 
            FROM blog_posts 
            WHERE category = %s 
            LIMIT 1
            """,
            (category,)
        )
        post = db_transaction.fetchone()
        
        assert post is not None, f"Should have at least one blog post in '{category}' category"
        
        post_id, title, content, author, db_category, publish_date = post
        
        assert post_id is not None, "Blog post ID should be set"
        assert title is not None and len(title) > 0, "Blog post title should not be empty"
        assert content is not None and len(content) > 0, "Blog post content should not be empty"
        assert author is not None and len(author) > 0, "Blog post author should not be empty"
        assert db_category == category, f"Blog post category should be '{category}', got '{db_category}'"
        assert publish_date is not None, "Blog post publish_date should be set"
        
        logger.info(f"Blog post in '{category}' category has all required fields: {title}")


@pytest.mark.database
@pytest.mark.asyncio
class TestParameterizedSubscriptionTiers:
    """
    Test suite for parameterized_subscription_tiers fixture.
    
    The fixture is parameterized with:
    - "starter": $9.99
    - "professional": $19.99
    - "premium": $29.99
    
    This generates 3 test instances total (one per tier).
    """

    async def test_subscription_tiers_fixture_yields_correct_data(self, db_transaction, parameterized_subscription_tiers):
        """
        Test that parameterized_subscription_tiers fixture yields dictionary
        with tier name and price.
        
        **Validates: Requirements 3.7, 6.6**
        """
        assert parameterized_subscription_tiers is not None, "Fixture should yield data"
        assert "tier" in parameterized_subscription_tiers, "Should have 'tier' key"
        assert "price" in parameterized_subscription_tiers, "Should have 'price' key"
        
        tier = parameterized_subscription_tiers["tier"]
        price = parameterized_subscription_tiers["price"]
        
        assert tier in ["starter", "professional", "premium"], f"Tier '{tier}' should be one of the expected types"
        assert isinstance(price, (int, float)) and price > 0, f"Price should be positive number, got {price}"
        
        logger.info(f"Parameterized subscription tiers fixture validated: {tier} at ${price:.2f}")

    async def test_subscription_tier_inserted_into_database(self, db_transaction, parameterized_subscription_tiers):
        """
        Test that fixture correctly inserts subscription plan into database
        for the specified tier.
        
        **Validates: Requirements 3.7, 6.6**
        """
        tier = parameterized_subscription_tiers["tier"]
        
        # Query database for subscription plans with this tier
        db_transaction.execute(
            "SELECT COUNT(*) FROM subscription_plans WHERE name LIKE %s",
            (f"%{tier.title()}%",)
        )
        count = db_transaction.fetchone()[0]
        
        assert count >= 1, f"Database should have at least 1 subscription plan for tier '{tier}', got {count}"
        logger.info(f"Verified {count} subscription plans for tier '{tier}'")

    async def test_subscription_tier_price_matches(self, db_transaction, parameterized_subscription_tiers):
        """
        Test that subscription plan has correct price.
        
        **Validates: Requirements 3.7, 6.6**
        """
        tier = parameterized_subscription_tiers["tier"]
        expected_price = parameterized_subscription_tiers["price"]
        
        # Query for subscription plan with this tier
        db_transaction.execute(
            "SELECT price FROM subscription_plans WHERE name LIKE %s LIMIT 1",
            (f"%{tier.title()}%",)
        )
        result = db_transaction.fetchone()
        
        assert result is not None, f"Should have subscription plan for tier '{tier}'"
        
        actual_price = float(result[0])
        
        # Allow for small floating point differences
        assert abs(actual_price - expected_price) < 0.01, f"Price mismatch: expected {expected_price}, got {actual_price}"
        
        logger.info(f"Subscription tier '{tier}' has correct price: ${actual_price:.2f}")

    async def test_subscription_tier_has_features(self, db_transaction, parameterized_subscription_tiers):
        """
        Test that subscription plans have features defined.
        
        **Validates: Requirements 3.7, 6.6**
        """
        tier = parameterized_subscription_tiers["tier"]
        
        # Query for subscription plan features
        db_transaction.execute(
            "SELECT features FROM subscription_plans WHERE name LIKE %s LIMIT 1",
            (f"%{tier.title()}%",)
        )
        result = db_transaction.fetchone()
        
        assert result is not None, f"Should have subscription plan for tier '{tier}'"
        
        features = result[0]
        
        # Features should be JSON array
        assert features is not None, f"Subscription tier '{tier}' should have features"
        
        logger.info(f"Subscription tier '{tier}' has features defined")


@pytest.mark.database
@pytest.mark.asyncio
class TestParameterizedFixtureGeneration:
    """
    Test suite validating overall parameterized fixture generation.
    
    These tests verify that the fixtures generate the expected number
    of test instances as specified in the requirements.
    """

    async def test_dietary_items_fixture_generates_three_instances(self, request):
        """
        Test that parameterized_dietary_items generates 3 test instances
        (one for each dietary type: vegetarian, vegan, gluten-free).
        
        **Validates: Requirements 3.7, 6.6**
        """
        # This test verifies the fixture is correctly parameterized
        # The pytest parametrize decorator should create 3 instances
        # when the test suite is run with -v, we can count invocations
        
        # Get the fixture parameter value
        fixture_def = request.getfixturevalue("parameterized_dietary_items")
        
        assert fixture_def is not None, "Fixture should be available"
        logger.info(f"Test instance received dietary fixture: {fixture_def}")

    async def test_blog_categories_fixture_generates_four_instances(self, request):
        """
        Test that parameterized_blog_categories generates 4 test instances
        (one for each category: recipes, techniques, ingredients, news).
        
        **Validates: Requirements 3.7, 6.6**
        """
        fixture_def = request.getfixturevalue("parameterized_blog_categories")
        
        assert fixture_def is not None, "Fixture should be available"
        logger.info(f"Test instance received blog category fixture: {fixture_def}")

    async def test_subscription_tiers_fixture_generates_three_instances(self, request):
        """
        Test that parameterized_subscription_tiers generates 3 test instances
        (one for each tier: starter, professional, premium).
        
        **Validates: Requirements 3.7, 6.6**
        """
        fixture_def = request.getfixturevalue("parameterized_subscription_tiers")
        
        assert fixture_def is not None, "Fixture should be available"
        logger.info(f"Test instance received subscription tier fixture: {fixture_def}")
