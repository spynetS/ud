#!/usr/bin/env python3

import random
from io import BytesIO
from django.core.files import File
from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from PIL import Image
from profiles.models import School, UserImage

User = get_user_model()

FIRST_NAMES = ['Alice', 'Bob', 'Charlie', 'Diana', 'Eve', 'Frank', 'Grace', 'Hugo']
LAST_NAMES = ['Anderson', 'Brown', 'Clark', 'Davis', 'Evans', 'Ford', 'Garcia', 'Harris']
PRONOUNS = ['he/him', 'she/her']
PROGRAMS = ['Science', 'Arts', 'Engineering', 'Business', 'Law']

COLORS = ['#810001', '#003366', '#008000', '#FFD700', '#FF4500']

class Command(BaseCommand):
    help = 'Create fake schools, users, and images for testing'

    def add_arguments(self, parser):
        parser.add_argument('--schools', type=int, default=3, help='Number of schools to create')
        parser.add_argument('--users', type=int, default=50, help='Number of users to create')

    def handle(self, *args, **options):
        num_schools = options['schools']
        num_users = options['users']

        # Create users
        for i in range(num_users):
            first_name = random.choice(FIRST_NAMES)
            last_name = random.choice(LAST_NAMES)
            pronoun = random.choice(PRONOUNS)
            program = random.choice(PROGRAMS)
            school = random.choice(School.objects.all())
            swipes = random.randint(0, 100)

            username = f"{first_name.lower()}{last_name.lower()}{i}"
            email = f"{username}@example.com"

            user, created = User.objects.get_or_create(
                username=username,
                defaults={
                    'first_name': first_name,
                    'last_name': last_name,
                    'pronoun': pronoun,
                    'programe': program,
                    'school': school,
                    'swipes': swipes,
                    'email': email,
                    'verified': True
                }
            )
            if created:
                user.set_password('password123')
                user.save()
                self.stdout.write(self.style.SUCCESS(f"Created user: {username} ({pronoun}) in {school.name}, swipes: {swipes}"))

                # Create 1–3 images per user
                num_images = random.randint(1, 3)
                for j in range(num_images):
                    # Generate a simple colored image
                    img = Image.new('RGB', (300, 300), color=random.choice(COLORS))
                    buffer = BytesIO()
                    img.save(buffer, format='PNG')
                    buffer.seek(0)

                    image_file = File(buffer, name=f"{username}_img{j}.png")
                    UserImage.objects.create(user=user, image=image_file, position=j)

        self.stdout.write(self.style.SUCCESS(f"Successfully created {num_users} users with images across {num_schools} schools."))
        # After creating all users and images
        self.stdout.write(self.style.SUCCESS("Simulating swipes between users..."))

        all_users = list(User.objects.all())

        for user in all_users:
            # Each user swipes on 1–5 other random users
            swipe_targets = random.sample([u for u in all_users if u != user], k=random.randint(1, 5))

        for target in swipe_targets:
            target.swipes += 1  # Increment the swipes count of the target
            target.save()

        self.stdout.write(self.style.SUCCESS("Swipes simulation completed."))
