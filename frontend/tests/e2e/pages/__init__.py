"""
Page objects package for UI automation.

Contains page object classes that encapsulate selectors and interactions
for each page/feature of the Get-Mumm application.
"""

from .base_page import BasePage
from .home_page import HomePage
from .menu_page import MenuPage
from .chefs_page import ChefsPage
from .blog_page import BlogPage
from .contact_page import ContactPage
from .subscriptions_page import SubscriptionsPage

__all__ = [
    "BasePage",
    "HomePage",
    "MenuPage",
    "ChefsPage",
    "BlogPage",
    "ContactPage",
    "SubscriptionsPage",
]
