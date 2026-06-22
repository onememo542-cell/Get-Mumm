"""
Database fixtures for test infrastructure.

This module provides:
- Database connection pool (session-scoped)
- Database transaction management (function-scoped)
- Database seeding fixtures with test data
- Parameterized fixtures for data variation
"""

import pytest
import psycopg2
from psycopg2 import sql
import logging
import traceback
from typing import Dict, List, Any

logger = logging.getLogger(__name__)


@pytest.fixture(scope="session")
def db_connection_pool(test_env):
    """
    Session-scoped fixture for database connection pool.
    Established once per test session, shared across all tests for read-only queries.
    
    Features:
    - Single connection pool reused across all tests
    - Configured with test environment credentials
    - Proper connection establishment logging
    - Connection closure on session completion
    - Error handling with detailed diagnostics

    Args:
        test_env: Test environment configuration fixture with:
            - db_name: Database name (e.g., 'test_db')
            - db_user: Database user (e.g., 'test_user')
            - db_password: Database password
            - db_host: Database host (e.g., 'postgres-test')
            - db_port: Database port (e.g., 5432)

    Yields:
        psycopg2 connection object for use in tests

    Raises:
        psycopg2.Error: If connection to database fails with diagnostic information
    """
    conn = None
    try:
        logger.info(
            f"Establishing database connection to {test_env['db_host']}:{test_env['db_port']}/{test_env['db_name']}"
        )
        conn = psycopg2.connect(
            dbname=test_env["db_name"],
            user=test_env["db_user"],
            password=test_env["db_password"],
            host=test_env["db_host"],
            port=test_env["db_port"]
        )
        logger.info("Database connection pool established successfully")
        yield conn
        
    except psycopg2.OperationalError as e:
        logger.error(
            f"Failed to connect to database at {test_env['db_host']}:{test_env['db_port']}/{test_env['db_name']}: {str(e)}"
        )
        logger.error(f"Traceback: {traceback.format_exc()}")
        raise
    except psycopg2.Error as e:
        logger.error(f"Database connection error: {str(e)}")
        logger.error(f"Error type: {type(e).__name__}")
        logger.error(f"Traceback: {traceback.format_exc()}")
        raise
    finally:
        try:
            if conn is not None:
                conn.close()
                logger.info("Database connection pool closed")
        except Exception as e:
            logger.error(f"Error closing database connection: {str(e)}")


@pytest.fixture(scope="function")
def db_transaction(db_connection_pool):
    """
    Function-scoped fixture for transaction management.
    Creates a new transaction for each test, rolls back after test completes.
    Provides data isolation between tests.
    
    Features:
    - Automatic transaction rollback after each test
    - Error handling with detailed logging and traceback
    - Diagnostic information on transaction failures
    - Ensures rollback happens even on error

    Args:
        db_connection_pool: Session-scoped database connection

    Yields:
        psycopg2 cursor object within transaction
        
    Raises:
        Exception: Re-raises any database errors after cleanup with diagnostic info
    """
    conn = db_connection_pool
    cursor = None
    
    try:
        cursor = conn.cursor()
        conn.autocommit = False
        conn.begin()
        logger.info("Database transaction started")

        yield cursor

    except psycopg2.Error as e:
        # Log the error with full traceback and diagnostic information
        logger.error(f"Database error during test execution: {str(e)}")
        logger.error(f"Error type: {type(e).__name__}")
        logger.error(f"Error code: {getattr(e, 'pgcode', 'N/A')}")
        logger.error(f"Traceback: {traceback.format_exc()}")
        
        # Attempt rollback to clean up state
        try:
            conn.rollback()
            logger.info("Transaction rolled back due to error")
        except Exception as rollback_error:
            logger.error(f"Error during rollback: {str(rollback_error)}")
        
        # Re-raise with diagnostic context
        raise Exception(
            f"Database transaction failed: {str(e)}. "
            f"Transaction rolled back and test failed with diagnostic information."
        ) from e
        
    except Exception as e:
        # Handle non-database errors
        logger.error(f"Unexpected error during test: {str(e)}")
        logger.error(f"Traceback: {traceback.format_exc()}")
        
        # Ensure rollback happens even for non-database errors
        try:
            conn.rollback()
            logger.info("Transaction rolled back due to unexpected error")
        except Exception as rollback_error:
            logger.error(f"Error during rollback: {str(rollback_error)}")
        
        raise
        
    finally:
        # Ensure cursor is closed
        try:
            if cursor is not None:
                cursor.close()
                logger.info("Database cursor closed")
        except Exception as e:
            logger.error(f"Error closing cursor: {str(e)}")
        
        # Final rollback to ensure transaction is cleaned up
        try:
            conn.rollback()
            logger.info("Database transaction rolled back and cleaned up")
        except Exception as e:
            logger.error(f"Error during final cleanup rollback: {str(e)}")


@pytest.fixture(scope="function")
def seed_menu_items(db_transaction):
    """
    Fixture for seeding test menu items with diverse categories and dietary restrictions.

    Args:
        db_transaction: Transaction-scoped database cursor

    Yields:
        Database cursor for test use
    """
    seed_sql = """
    INSERT INTO menu_items (name, category, price, dietary_info, description, image_url)
    VALUES 
        ('Vegetable Risotto', 'mains', 14.99, 'vegetarian', 'Creamy risotto with seasonal vegetables', NULL),
        ('Grilled Salmon', 'mains', 22.99, 'gluten-free', 'Atlantic salmon with lemon butter sauce', NULL),
        ('Vegan Buddha Bowl', 'salads', 12.99, 'vegan', 'Mixed grains with roasted vegetables and tahini dressing', NULL),
        ('Classic Burger', 'mains', 10.99, NULL, 'Grass-fed beef with homemade aioli', NULL),
        ('Caprese Salad', 'salads', 9.99, 'vegetarian', 'Fresh mozzarella, tomato, basil, balsamic vinegar', NULL),
        ('Grilled Chicken Breast', 'mains', 18.99, 'gluten-free', 'Herb-seasoned chicken breast with seasonal vegetables', NULL),
        ('Vegan Pasta', 'mains', 13.99, 'vegan', 'Gluten-free pasta with marinara sauce and vegetables', NULL),
        ('Chocolate Cake', 'desserts', 7.99, 'vegetarian', 'Rich chocolate cake with ganache', NULL),
        ('Fresh Juice', 'beverages', 5.99, 'vegan', 'Cold-pressed organic juice blend', NULL),
        ('Espresso', 'beverages', 3.99, 'vegan', 'Single or double shot espresso', NULL)
    ON CONFLICT DO NOTHING;
    """
    db_transaction.execute(seed_sql)
    logger.info("Menu items seeded")
    yield db_transaction


@pytest.fixture(scope="function")
def seed_chefs(db_transaction):
    """
    Fixture for seeding test chef profiles.

    Args:
        db_transaction: Transaction-scoped database cursor

    Yields:
        Database cursor for test use
    """
    seed_sql = """
    INSERT INTO chefs (name, bio, specialties, image_url)
    VALUES 
        ('Chef Marco', 'Italian chef with 20 years experience', 'Italian Cuisine, Pasta, Risotto', NULL),
        ('Chef Sarah', 'French pastry chef specialized in desserts', 'French Pastry, Baking, Chocolate', NULL),
        ('Chef James', 'Farm-to-table chef focused on sustainable cooking', 'Organic, Vegetarian, Farm-to-table', NULL),
        ('Chef Yuki', 'Japanese sushi and Asian cuisine expert', 'Sushi, Asian Fusion, Japanese', NULL),
        ('Chef Rosa', 'Spanish tapas and Mediterranean specialist', 'Mediterranean, Tapas, Spanish', NULL)
    ON CONFLICT DO NOTHING;
    """
    db_transaction.execute(seed_sql)
    logger.info("Chefs seeded")
    yield db_transaction


@pytest.fixture(scope="function")
def seed_blog_posts(db_transaction):
    """
    Fixture for seeding test blog posts.

    Args:
        db_transaction: Transaction-scoped database cursor

    Yields:
        Database cursor for test use
    """
    seed_sql = """
    INSERT INTO blog_posts (title, content, author, category, publish_date, image_url)
    VALUES 
        ('Perfect Pasta Technique', 'Learn the secrets to making perfect pasta...', 'Chef Marco', 'techniques', NOW(), NULL),
        ('Seasonal Vegetables Guide', 'Discover what vegetables are in season this month...', 'Chef James', 'ingredients', NOW(), NULL),
        ('Chocolate Mousse Recipe', 'A classic French chocolate mousse recipe...', 'Chef Sarah', 'recipes', NOW(), NULL),
        ('Sushi Rolling Basics', 'Master the art of rolling perfect sushi...', 'Chef Yuki', 'techniques', NOW(), NULL),
        ('Farm Visit Report', 'Visit to local organic farm in the countryside...', 'Chef James', 'news', NOW(), NULL),
        ('Sous Vide Cooking', 'Everything you need to know about sous vide...', 'Chef Marco', 'techniques', NOW(), NULL),
        ('Vegan Baking Tips', 'How to bake amazing desserts without eggs or dairy...', 'Chef Sarah', 'recipes', NOW(), NULL),
        ('Seasonal Menu Planning', 'How we plan our seasonal menus...', 'Chef Rosa', 'news', NOW(), NULL)
    ON CONFLICT DO NOTHING;
    """
    db_transaction.execute(seed_sql)
    logger.info("Blog posts seeded")
    yield db_transaction


@pytest.fixture(scope="function")
def seed_subscriptions(db_transaction):
    """
    Fixture for seeding subscription plans.

    Args:
        db_transaction: Transaction-scoped database cursor

    Yields:
        Database cursor for test use
    """
    seed_sql = """
    INSERT INTO subscription_plans (name, price, billing_cycle, features)
    VALUES 
        ('Starter', 9.99, 'monthly', '["5 meals per week", "Basic support", "Recipe access"]'),
        ('Professional', 19.99, 'monthly', '["10 meals per week", "Priority support", "Recipe access", "Weekly updates"]'),
        ('Premium', 29.99, 'monthly', '["Unlimited meals", "24/7 support", "Recipe access", "Weekly updates", "Custom meal plans"]'),
        ('Starter Annual', 99.99, 'annual', '["5 meals per week", "Basic support", "Recipe access"]'),
        ('Professional Annual', 199.99, 'annual', '["10 meals per week", "Priority support", "Recipe access", "Weekly updates"]'),
        ('Premium Annual', 299.99, 'annual', '["Unlimited meals", "24/7 support", "Recipe access", "Weekly updates", "Custom meal plans"]')
    ON CONFLICT DO NOTHING;
    """
    db_transaction.execute(seed_sql)
    logger.info("Subscription plans seeded")
    yield db_transaction


@pytest.fixture(scope="function", params=[
    {"dietary": "vegetarian", "count": 3},
    {"dietary": "vegan", "count": 2},
    {"dietary": "gluten-free", "count": 4}
])
def parameterized_dietary_items(db_transaction, request):
    """
    Parameterized fixture generating multiple test instances with different dietary categories.
    Enables testing of menu items across different dietary restriction types.

    Args:
        db_transaction: Transaction-scoped database cursor
        request: Pytest request object with parameterized values

    Yields:
        Dictionary with dietary type and count of inserted items
    """
    dietary = request.param["dietary"]
    count = request.param["count"]

    # Insert test menu items for each dietary type
    for i in range(count):
        insert_sql = """
        INSERT INTO menu_items (name, category, price, dietary_info, description)
        VALUES (%s, %s, %s, %s, %s)
        """
        item_name = f"{dietary.title()} Item {i + 1}"
        db_transaction.execute(
            insert_sql,
            (item_name, "mains", 9.99 + i, dietary, f"Test {dietary} menu item")
        )

    logger.info(f"Seeded {count} {dietary} menu items")
    yield {"dietary": dietary, "count": count}


@pytest.fixture(scope="function", params=[
    {"category": "recipes"},
    {"category": "techniques"},
    {"category": "ingredients"},
    {"category": "news"}
])
def parameterized_blog_categories(db_transaction, request):
    """
    Parameterized fixture generating blog posts for each category.

    Args:
        db_transaction: Transaction-scoped database cursor
        request: Pytest request object with parameterized category

    Yields:
        Dictionary with blog category for current test instance
    """
    category = request.param["category"]

    insert_sql = """
    INSERT INTO blog_posts (title, content, author, category, publish_date)
    VALUES (%s, %s, %s, %s, NOW())
    """
    title = f"Test {category.title()} Post"
    content = f"This is a test blog post about {category}."
    db_transaction.execute(insert_sql, (title, content, "Test Author", category))

    logger.info(f"Seeded blog post for category: {category}")
    yield {"category": category}


@pytest.fixture(scope="function", params=[
    {"tier": "starter", "price": 9.99},
    {"tier": "professional", "price": 19.99},
    {"tier": "premium", "price": 29.99}
])
def parameterized_subscription_tiers(db_transaction, request):
    """
    Parameterized fixture generating subscription plan instances for each tier.

    Args:
        db_transaction: Transaction-scoped database cursor
        request: Pytest request object with parameterized tier

    Yields:
        Dictionary with subscription tier and price for current test instance
    """
    tier = request.param["tier"]
    price = request.param["price"]

    insert_sql = """
    INSERT INTO subscription_plans (name, price, billing_cycle, features)
    VALUES (%s, %s, %s, %s)
    """
    features = {
        "starter": ["5 meals per week", "Basic support"],
        "professional": ["10 meals per week", "Priority support", "Weekly updates"],
        "premium": ["Unlimited meals", "24/7 support", "Custom meal plans"]
    }

    import json
    db_transaction.execute(
        insert_sql,
        (f"Test {tier.title()}", price, "monthly", json.dumps(features.get(tier, [])))
    )

    logger.info(f"Seeded subscription tier: {tier} at ${price}")
    yield {"tier": tier, "price": price}
