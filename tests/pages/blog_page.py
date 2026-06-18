"""
BlogPage object providing methods and selectors for blog page interactions.

This module defines the BlogPage class which inherits from BasePage and provides:
- Selectors for blog posts and categories
- Methods for retrieving blog post information
- Methods for filtering and searching blog posts
"""

import logging
from typing import List, Dict, Any
from playwright.async_api import Page
from .base_page import BasePage

logger = logging.getLogger(__name__)


class BlogPage(BasePage):
    """
    Page object for the blog page.
    Provides methods to interact with blog posts, filtering, and navigation.
    """

    # Selectors
    BLOG_POSTS_CONTAINER = "div.blog-posts-container"
    BLOG_POST_CARD = "article.blog-post-card"
    POST_TITLE = "h3.post-title"
    POST_CONTENT = "div.post-content"
    POST_EXCERPT = "p.post-excerpt"
    POST_DATE = "span.post-date"
    POST_AUTHOR = "span.post-author"
    CATEGORY_FILTER = "select[name='category']"
    POST_CATEGORY = "span.post-category"

    def __init__(self, page: Page):
        """
        Initialize BlogPage object.

        Args:
            page: Playwright page object
        """
        super().__init__(page)
        logger.info("BlogPage initialized")

    async def assert_page_loaded(self) -> None:
        """
        Verify that blog page has fully loaded.
        
        Checks for visibility of:
        - Blog posts container

        Raises:
            AssertionError: If critical page elements are not visible
        """
        logger.info("Verifying blog page has loaded...")
        
        container_loaded = await self.wait_for_element(self.BLOG_POSTS_CONTAINER)
        
        assert container_loaded, "Blog posts container not visible"
        
        logger.info("Blog page successfully loaded")

    async def get_blog_posts(self) -> List[Dict[str, Any]]:
        """
        Get all blog posts currently displayed on the page.

        Returns:
            List of dictionaries containing blog post information
            Each dict includes: title, excerpt, date, author, category

        Raises:
            Exception: If blog posts not found
        """
        logger.info("Retrieving blog posts...")
        
        posts = []
        post_elements = self.page.locator(self.BLOG_POST_CARD)
        count = await post_elements.count()
        
        for i in range(count):
            element = post_elements.nth(i)
            
            # Get post details
            title_text = await element.locator(self.POST_TITLE).text_content()
            excerpt_text = await element.locator(self.POST_EXCERPT).text_content() if await element.locator(self.POST_EXCERPT).is_visible() else ""
            date_text = await element.locator(self.POST_DATE).text_content() if await element.locator(self.POST_DATE).is_visible() else ""
            author_text = await element.locator(self.POST_AUTHOR).text_content() if await element.locator(self.POST_AUTHOR).is_visible() else ""
            category_text = await element.locator(self.POST_CATEGORY).text_content() if await element.locator(self.POST_CATEGORY).is_visible() else ""
            
            posts.append({
                "title": (title_text or "").strip(),
                "excerpt": (excerpt_text or "").strip() if excerpt_text else None,
                "date": (date_text or "").strip() if date_text else None,
                "author": (author_text or "").strip() if author_text else None,
                "category": (category_text or "").strip() if category_text else None
            })
        
        logger.info(f"Retrieved {len(posts)} blog posts")
        return posts

    async def get_post_content(self, post_title: str) -> Dict[str, Any]:
        """
        Get detailed content of a specific blog post.

        Args:
            post_title: Title of the blog post to retrieve

        Returns:
            Dictionary containing post content information:
            - title: Post title
            - excerpt: Post excerpt
            - content: Full post content
            - date: Publication date
            - author: Post author
            - category: Post category

        Raises:
            Exception: If post not found
        """
        logger.info(f"Retrieving content for post: {post_title}")
        
        # Find the blog post card by title
        post_card = self.page.locator(self.BLOG_POST_CARD).filter(has_text=post_title)
        
        if not await post_card.is_visible():
            logger.error(f"Blog post not found: {post_title}")
            raise ValueError(f"Blog post '{post_title}' not found on page")
        
        # Extract post details
        title_text = await post_card.locator(self.POST_TITLE).text_content()
        excerpt_text = await post_card.locator(self.POST_EXCERPT).text_content() if await post_card.locator(self.POST_EXCERPT).is_visible() else ""
        date_text = await post_card.locator(self.POST_DATE).text_content() if await post_card.locator(self.POST_DATE).is_visible() else ""
        author_text = await post_card.locator(self.POST_AUTHOR).text_content() if await post_card.locator(self.POST_AUTHOR).is_visible() else ""
        category_text = await post_card.locator(self.POST_CATEGORY).text_content() if await post_card.locator(self.POST_CATEGORY).is_visible() else ""
        content_text = await post_card.locator(self.POST_CONTENT).text_content() if await post_card.locator(self.POST_CONTENT).is_visible() else ""
        
        post_info = {
            "title": (title_text or "").strip(),
            "excerpt": (excerpt_text or "").strip() if excerpt_text else None,
            "content": (content_text or "").strip() if content_text else None,
            "date": (date_text or "").strip() if date_text else None,
            "author": (author_text or "").strip() if author_text else None,
            "category": (category_text or "").strip() if category_text else None
        }
        
        logger.info(f"Retrieved detailed content for post: {post_title}")
        return post_info

    async def apply_category_filter(self, category: str) -> None:
        """
        Apply category filter to blog posts.

        Args:
            category: Category value to filter by (e.g., 'recipes', 'techniques', 'news')

        Raises:
            Exception: If category filter not found or selection fails
        """
        logger.info(f"Applying category filter: {category}")
        await self.select_option(self.CATEGORY_FILTER, category)
        await self.page.wait_for_load_state("networkidle")
        logger.info(f"Category filter applied: {category}")

    async def click_post(self, post_title: str) -> None:
        """
        Click on a blog post to view full content.

        Args:
            post_title: Title of the blog post to click

        Raises:
            Exception: If post not found or click fails
        """
        logger.info(f"Clicking blog post: {post_title}")
        
        # Find and click the blog post card by title
        post_card = self.page.locator(self.BLOG_POST_CARD).filter(has_text=post_title)
        
        if not await post_card.is_visible():
            logger.error(f"Blog post not found: {post_title}")
            raise ValueError(f"Blog post '{post_title}' not found on page")
        
        await post_card.click()
        await self.wait_for_navigation()
        logger.info(f"Clicked blog post: {post_title}")

    async def get_blog_post_count(self) -> int:
        """
        Get the total number of blog posts on the page.

        Returns:
            int: Number of blog posts displayed

        Raises:
            Exception: If unable to count posts
        """
        logger.info("Getting blog post count...")
        
        post_elements = self.page.locator(self.BLOG_POST_CARD)
        count = await post_elements.count()
        
        logger.info(f"Total blog posts: {count}")
        return count

    async def is_post_visible(self, post_title: str) -> bool:
        """
        Check if a specific blog post is visible on the page.

        Args:
            post_title: Title of the blog post to check

        Returns:
            bool: True if post is visible, False otherwise
        """
        logger.info(f"Checking if post is visible: {post_title}")
        
        post_card = self.page.locator(self.BLOG_POST_CARD).filter(has_text=post_title)
        is_visible = await post_card.is_visible()
        
        logger.debug(f"Post visibility for '{post_title}': {is_visible}")
        return is_visible
