"""
Test fixtures package for test infrastructure.

Contains reusable fixtures for:
- Database connections and transactions
- Test data seeding
- API client and session management
- Browser and page object setup
"""

import pytest

# Import fixtures to make them available to all tests
from .database import (
    db_connection_pool,
    db_transaction,
    seed_menu_items,
    seed_chefs,
    seed_blog_posts,
    seed_subscriptions,
    parameterized_dietary_items,
    parameterized_blog_categories,
    parameterized_subscription_tiers,
)

from .api_client import (
    api_session,
    api_client,
    authenticated_api_client,
)

from .pages import (
    browser,
    page,
    home_page,
    menu_page,
    chefs_page,
    blog_page,
    contact_page,
    subscriptions_page,
)

__all__ = [
    # Database fixtures
    "db_connection_pool",
    "db_transaction",
    "seed_menu_items",
    "seed_chefs",
    "seed_blog_posts",
    "seed_subscriptions",
    "parameterized_dietary_items",
    "parameterized_blog_categories",
    "parameterized_subscription_tiers",
    # API fixtures
    "api_session",
    "api_client",
    "authenticated_api_client",
    # Browser and page fixtures
    "browser",
    "page",
    "home_page",
    "menu_page",
    "chefs_page",
    "blog_page",
    "contact_page",
    "subscriptions_page",
]
