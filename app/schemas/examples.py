"""Example data for Schemas."""


class ExampleUser:
    """Define a dummy user for Schema examples."""

    id = 25
    first_name = "John"
    last_name = "Doe"
    email = "user@example.com"
    password = "My S3cur3 P@ssw0rd"  # noqa: S105
    role = "user"
    banned = False
    verified = True

class ExampleProduct:

    id = 3
    code = "def add(a,b):\n    return a+b"
    price = 5600
    product_name = "Add funksiyasi"
    