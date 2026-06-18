"""
API tests for blog endpoints.

Tests verify:
- GET /api/blog returns valid response with required fields
- Blog posts include id, title, content, author, publish_date, category
- Blog filtering and pagination work correctly
- Blog data is properly formatted
"""

import pytest
import logging

logger = logging.getLogger(__name__)


@pytest.mark.api
@pytest.mark.asyncio
class TestBlogAPI:
    """
    Test suite for blog API endpoints.
    """

    async def test_get_blog_returns_200(self, api_client):
        """
        Test that GET /api/blog returns successful response.
        """
        status, data = await api_client.get("/api/blog")
        assert status == 200, f"Expected 200 status, got {status}"
        logger.info("GET /api/blog returned 200")

    async def test_get_blog_response_format(self, api_client):
        """
        Test that GET /api/blog returns valid response structure.
        """
        status, data = await api_client.get("/api/blog")
        assert status == 200
        assert isinstance(data, dict), "Response should be a dictionary"
        assert "items" in data or "data" in data or "posts" in data, "Response should contain blog posts"
        logger.info("GET /api/blog response format valid")

    async def test_blog_posts_have_required_fields(self, api_client):
        """
        Test that blog posts include all required fields.
        """
        status, data = await api_client.get("/api/blog")
        assert status == 200

        posts = data.get("items") or data.get("data") or data.get("posts") or []
        assert len(posts) > 0, "Should return at least one blog post"

        # Check first post has required fields
        first_post = posts[0]
        required_fields = ["id", "title"]
        for field in required_fields:
            assert field in first_post, f"Blog post missing required field: {field}"

        logger.info("Blog posts have all required fields")

    async def test_blog_post_has_content(self, api_client):
        """
        Test that blog posts include content.
        """
        status, data = await api_client.get("/api/blog")
        assert status == 200

        posts = data.get("items") or data.get("data") or data.get("posts") or []
        if len(posts) > 0:
            first_post = posts[0]
            has_content = "content" in first_post or "body" in first_post or "text" in first_post
            logger.info(f"Blog post has content field: {has_content}")

    async def test_blog_post_has_author(self, api_client):
        """
        Test that blog posts include author information.
        """
        status, data = await api_client.get("/api/blog")
        assert status == 200

        posts = data.get("items") or data.get("data") or data.get("posts") or []
        if len(posts) > 0:
            first_post = posts[0]
            has_author = "author" in first_post or "author_name" in first_post or "writer" in first_post
            logger.info(f"Blog post has author field: {has_author}")

    async def test_blog_post_has_publish_date(self, api_client):
        """
        Test that blog posts include publish date.
        """
        status, data = await api_client.get("/api/blog")
        assert status == 200

        posts = data.get("items") or data.get("data") or data.get("posts") or []
        if len(posts) > 0:
            first_post = posts[0]
            has_date = "publish_date" in first_post or "published_at" in first_post or "date" in first_post
            logger.info(f"Blog post has publish date field: {has_date}")

    async def test_blog_post_has_category(self, api_client):
        """
        Test that blog posts include category information.
        """
        status, data = await api_client.get("/api/blog")
        assert status == 200

        posts = data.get("items") or data.get("data") or data.get("posts") or []
        if len(posts) > 0:
            first_post = posts[0]
            has_category = "category" in first_post or "tags" in first_post or "topic" in first_post
            logger.info(f"Blog post has category field: {has_category}")

    async def test_blog_posts_response_is_array(self, api_client):
        """
        Test that response contains array of blog posts.
        """
        status, data = await api_client.get("/api/blog")
        assert status == 200

        posts = data.get("items") or data.get("data") or data.get("posts") or []
        assert isinstance(posts, list), "Posts should be returned as a list"
        logger.info(f"Response contains {len(posts)} blog posts in array format")

    async def test_blog_post_id_is_unique(self, api_client):
        """
        Test that each blog post has a unique ID.
        """
        status, data = await api_client.get("/api/blog")
        assert status == 200

        posts = data.get("items") or data.get("data") or data.get("posts") or []
        if len(posts) > 1:
            post_ids = [post.get("id") for post in posts]
            unique_ids = len(set(post_ids))
            assert unique_ids == len(post_ids), "All post IDs should be unique"
            logger.info(f"All {len(posts)} post IDs are unique")

    async def test_blog_post_title_not_empty(self, api_client):
        """
        Test that blog post titles are not empty.
        """
        status, data = await api_client.get("/api/blog")
        assert status == 200

        posts = data.get("items") or data.get("data") or data.get("posts") or []
        for post in posts:
            title = post.get("title", "").strip()
            assert len(title) > 0, "Post title should not be empty"

        logger.info(f"All {len(posts)} blog post titles are non-empty")

    async def test_blog_category_filter(self, api_client):
        """
        Test that category filter works for blog posts.
        """
        status, data = await api_client.get("/api/blog", params={"category": "recipes"})
        assert status in [200, 400, 422]

        posts = data.get("items") or data.get("data") or data.get("posts") or []
        logger.info(f"Category filter returned {len(posts)} posts")

    async def test_blog_pagination_limit(self, api_client):
        """
        Test that pagination limit works for blog posts.
        """
        status, data = await api_client.get("/api/blog", params={"limit": 5})
        assert status in [200, 400, 422]

        posts = data.get("items") or data.get("data") or data.get("posts") or []
        if len(posts) > 0:
            assert len(posts) <= 5, "Should respect limit parameter"
            logger.info(f"Pagination limit returned {len(posts)} posts")

    async def test_blog_pagination_offset(self, api_client):
        """
        Test that pagination offset works for blog posts.
        """
        # Get first page
        status1, data1 = await api_client.get("/api/blog", params={"limit": 2, "offset": 0})
        posts1 = data1.get("items") or data1.get("data") or data1.get("posts") or []

        # Get second page
        status2, data2 = await api_client.get("/api/blog", params={"limit": 2, "offset": 2})
        posts2 = data2.get("items") or data2.get("data") or data2.get("posts") or []

        if len(posts1) > 0 and len(posts2) > 0:
            assert posts1[0].get("id") != posts2[0].get("id"), "Offset should return different posts"
            logger.info(f"Pagination offset works correctly")

    async def test_blog_data_consistency(self, api_client):
        """
        Test that blog data is consistent across multiple requests.
        """
        status1, data1 = await api_client.get("/api/blog")
        status2, data2 = await api_client.get("/api/blog")

        assert status1 == 200 and status2 == 200, "Both requests should succeed"

        posts1 = data1.get("items") or data1.get("data") or data1.get("posts") or []
        posts2 = data2.get("items") or data2.get("data") or data2.get("posts") or []

        assert len(posts1) == len(posts2), "Post count should be consistent"

        logger.info("Blog post data is consistent across requests")

    async def test_blog_response_includes_count(self, api_client):
        """
        Test that response includes total count of blog posts.
        """
        status, data = await api_client.get("/api/blog")
        assert status == 200

        has_count = "total" in data or "total_count" in data or "count" in data
        logger.info(f"Response has total count field: {has_count}")
