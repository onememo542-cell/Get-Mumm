"""
ContactPage object providing methods and selectors for contact form interactions.

This module defines the ContactPage class which inherits from BasePage and provides:
- Selectors for contact form fields and buttons
- Methods for filling out contact form
- Methods for form submission and validation
- Methods for retrieving success messages
"""

import logging
from playwright.async_api import Page
from .base_page import BasePage

logger = logging.getLogger(__name__)


class ContactPage(BasePage):
    """
    Page object for the contact page.
    Provides methods to interact with the contact form and validation.
    """

    # Selectors
    CONTACT_FORM = "form#contact-form"
    NAME_INPUT = "input[name='name']"
    EMAIL_INPUT = "input[name='email']"
    SUBJECT_INPUT = "input[name='subject']"
    MESSAGE_INPUT = "textarea[name='message']"
    PHONE_INPUT = "input[name='phone']"
    SUBMIT_BUTTON = "button[type='submit'][name='submit']"
    SUCCESS_MESSAGE = "div.success-message"
    ERROR_MESSAGE = "div.error-message"
    FORM_ERROR = "div.form-error"

    def __init__(self, page: Page):
        """
        Initialize ContactPage object.

        Args:
            page: Playwright page object
        """
        super().__init__(page)
        logger.info("ContactPage initialized")

    async def assert_page_loaded(self) -> None:
        """
        Verify that contact page has fully loaded.
        
        Checks for visibility of:
        - Contact form

        Raises:
            AssertionError: If critical page elements are not visible
        """
        logger.info("Verifying contact page has loaded...")
        
        form_loaded = await self.wait_for_element(self.CONTACT_FORM)
        
        assert form_loaded, "Contact form not visible"
        
        logger.info("Contact page successfully loaded")

    async def fill_contact_form(
        self,
        name: str,
        email: str,
        subject: str,
        message: str,
        phone: str = None
    ) -> None:
        """
        Fill out all contact form fields.

        Args:
            name: Sender's name
            email: Sender's email address
            subject: Message subject
            message: Message body
            phone: Optional phone number

        Raises:
            Exception: If form fields not found or fill fails
        """
        logger.info("Filling contact form...")
        
        # Fill required fields
        await self.fill_text(self.NAME_INPUT, name)
        await self.fill_text(self.EMAIL_INPUT, email)
        await self.fill_text(self.SUBJECT_INPUT, subject)
        await self.fill_text(self.MESSAGE_INPUT, message)
        
        # Fill optional phone field if provided
        if phone:
            await self.fill_text(self.PHONE_INPUT, phone)
        
        logger.info("Contact form filled successfully")

    async def fill_name(self, name: str) -> None:
        """
        Fill the name field.

        Args:
            name: Sender's name

        Raises:
            Exception: If name field not found
        """
        logger.info(f"Filling name field: {name}")
        await self.fill_text(self.NAME_INPUT, name)

    async def fill_email(self, email: str) -> None:
        """
        Fill the email field.

        Args:
            email: Sender's email address

        Raises:
            Exception: If email field not found
        """
        logger.info(f"Filling email field: {email}")
        await self.fill_text(self.EMAIL_INPUT, email)

    async def fill_subject(self, subject: str) -> None:
        """
        Fill the subject field.

        Args:
            subject: Message subject

        Raises:
            Exception: If subject field not found
        """
        logger.info(f"Filling subject field: {subject}")
        await self.fill_text(self.SUBJECT_INPUT, subject)

    async def fill_message(self, message: str) -> None:
        """
        Fill the message field.

        Args:
            message: Message body

        Raises:
            Exception: If message field not found
        """
        logger.info(f"Filling message field: {message[:50]}...")
        await self.fill_text(self.MESSAGE_INPUT, message)

    async def fill_phone(self, phone: str) -> None:
        """
        Fill the phone field (optional).

        Args:
            phone: Phone number

        Raises:
            Exception: If phone field not found
        """
        logger.info(f"Filling phone field: {phone}")
        await self.fill_text(self.PHONE_INPUT, phone)

    async def submit_form(self) -> bool:
        """
        Submit the contact form.

        Returns:
            bool: True if submission was successful, False otherwise

        Raises:
            Exception: If submit button not found or click fails
        """
        logger.info("Submitting contact form...")
        
        # Click submit button
        await self.click(self.SUBMIT_BUTTON)
        
        # Wait for response (either success or error)
        await self.page.wait_for_load_state("networkidle")
        
        # Check for success message
        success_found = await self.wait_for_element(self.SUCCESS_MESSAGE, timeout=5000)
        
        if success_found:
            logger.info("Form submitted successfully")
            return True
        else:
            logger.warning("Form submission may have failed")
            return False

    async def get_success_message(self) -> str:
        """
        Get the success message after form submission.

        Returns:
            str: Success message text

        Raises:
            Exception: If success message not found
        """
        logger.info("Retrieving success message...")
        
        message = await self.get_text(self.SUCCESS_MESSAGE)
        logger.info(f"Success message: {message}")
        return message

    async def get_error_messages(self) -> list:
        """
        Get all error messages on the form.

        Returns:
            list: List of error message texts

        Raises:
            Exception: If unable to retrieve errors
        """
        logger.info("Retrieving error messages...")
        
        error_elements = self.page.locator(self.ERROR_MESSAGE)
        errors = []
        
        count = await error_elements.count()
        
        for i in range(count):
            error_text = await error_elements.nth(i).text_content()
            if error_text:
                errors.append(error_text.strip())
        
        logger.info(f"Found {len(errors)} error messages")
        return errors

    async def clear_form(self) -> None:
        """
        Clear all form fields.

        Raises:
            Exception: If form fields not found
        """
        logger.info("Clearing contact form...")
        
        await self.fill_text(self.NAME_INPUT, "")
        await self.fill_text(self.EMAIL_INPUT, "")
        await self.fill_text(self.SUBJECT_INPUT, "")
        await self.fill_text(self.MESSAGE_INPUT, "")
        
        # Only clear phone if it exists
        if await self.is_visible(self.PHONE_INPUT):
            await self.fill_text(self.PHONE_INPUT, "")
        
        logger.info("Contact form cleared")

    async def is_submit_button_enabled(self) -> bool:
        """
        Check if submit button is enabled.

        Returns:
            bool: True if button is enabled, False otherwise
        """
        logger.info("Checking if submit button is enabled...")
        return await self.is_enabled(self.SUBMIT_BUTTON)

    async def has_form_error(self) -> bool:
        """
        Check if form has any validation errors displayed.

        Returns:
            bool: True if form errors are visible, False otherwise
        """
        logger.info("Checking for form errors...")
        errors = await self.get_error_messages()
        return len(errors) > 0

    async def is_field_visible(self, field_name: str) -> bool:
        """
        Check if a specific form field is visible.

        Args:
            field_name: Name of the field ('name', 'email', 'subject', 'message', 'phone')

        Returns:
            bool: True if field is visible, False otherwise
        """
        logger.info(f"Checking if field is visible: {field_name}")
        
        field_map = {
            "name": self.NAME_INPUT,
            "email": self.EMAIL_INPUT,
            "subject": self.SUBJECT_INPUT,
            "message": self.MESSAGE_INPUT,
            "phone": self.PHONE_INPUT
        }
        
        selector = field_map.get(field_name)
        if not selector:
            logger.error(f"Unknown field name: {field_name}")
            return False
        
        return await self.is_visible(selector)
