from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from accounts.models import UserProfile
from main.models import Question, Answer, Tag
from faker import Faker
import random

fake = Faker()

class Command(BaseCommand):
    help = "Seed the database with fake users, profiles, questions, answers, and tags"

    def handle(self, *args, **kwargs):
        self.stdout.write("🔄 Seeding database...")
        self.seed_users(10)
        self.seed_tags(10)
        self.seed_questions_and_answers(20)
        self.stdout.write(self.style.SUCCESS("✅ Done seeding!"))

    def seed_users(self, count):
        for _ in range(count):
            username = fake.user_name()
            email = fake.unique.email()
            password = "test1234"
            user = User.objects.create_user(username=username, email=email, password=password)
            UserProfile.objects.create(user=user, full_name=fake.name(), email=email)
        self.stdout.write(f"👤 Created {count} users")

    def seed_tags(self, count):
        tag_names = set()
        while len(tag_names) < count:
            tag_names.add(fake.word())
        for name in tag_names:
            Tag.objects.get_or_create(name=name)
        self.stdout.write(f"🏷️ Created {count} tags")

    def seed_questions_and_answers(self, count):
        users = list(User.objects.all())
        tags = list(Tag.objects.all())

        for _ in range(count):
            user = random.choice(users)
            q = Question.objects.create(
                title=fake.sentence(nb_words=6),
                description=fake.paragraph(nb_sentences=3),
                user=user,
            )
            selected_tags = random.sample(tags, k=random.randint(1, 3))
            q.tags.set(selected_tags)

            num_answers = random.randint(1, 4)
            for _ in range(num_answers):
                Answer.objects.create(
                    question=q,
                    user=random.choice(users),
                    content=fake.paragraph(nb_sentences=2),
                    is_accepted=random.random() < 0.3,
                )
        self.stdout.write(f"❓ Created {count} questions with answers")
