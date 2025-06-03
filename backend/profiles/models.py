from django.contrib.auth.models import AbstractUser, Group, Permission
from django.db import models

SCHOOL_COLORS = {
    # Röd
    "Skandinaviens akademi för psykoterapiutveckling": "#810001",
    "Svenska institutet för kognitiv psykoterapi":     "#810001",
    "Röda Korsets Högskola":                         "#810001",
    "Brunnsviks folkhögskola":                       "#810001",
    "Uppsala Universitet":                           "#810001",
    "Örebro universitet":                            "#810001",
    "Kungliga Musikhögskolan":                       "#810001",
    "Malmö universitet":                             "#810001",

    # Mörkblå
    "Världssjöfartsuniversitetet":                   "#082af5",
    "Sophiahemmet Högskola":                         "#082af5",
    "Gymnastik- och idrottshögskolans":              "#082af5",
    "Chalmers Lunds universitet":                    "#082af5",
    "Stockholm universitet":                         "#082af5",
    "Umeå Universitet":                              "#082af5",
    "Kungliga Tekniska Högskolan":                   "#082af5",
    "Luleå tekniska universitet":                    "#082af5",
    "Högskolan i Borås":                             "#082af5",

    # Turkos
    "Akademi för ledarskap och teologi":             "#00464a",
    "Stockholms Musikpedagogiska Institut":          "#00464a",
    "Blekinge Tekniska Högskola":                    "#00464a",
    "Försvarshögskolan":                             "#00464a",

    # Ljusblå
    "Högskolan Väst":                                "#00b8e7",
    "Högskolan i Halmstad":                          "#00b8e7",
    "Mittuniversitetet":                             "#00b8e7",
    "Linköpings Universitet":                        "#00b8e7",

    # Rosa
    "Newmaninstitutet":                              "#FF69B4",
    "Konstfack":                                     "#FF69B4",
    "Beckmans designhögskola":                       "#FF69B4",
    "Högskolan i Skövde":                            "#FF69B4",
    "Göteborg universitet":                          "#FF69B4",
    "Stiftelsen Högskolan i Jönköping":              "#FF69B4",

    # Lila
    "Karolinska Institutet":                         "#4F0432",
    "Högskolan Dalarna":                             "#4F0432",

    # Grå
    "Handels":                                       "#BDC3C6",
    "Kungliga Konsthögskolan":                       "#BDC3C6",

    # Grön
    "Johannelunds teologiska högskola":              "#00351d",
    "Gammelkroppa skogsskola":                       "#00351d",
    "Stockholms konstnärliga högskola":              "#00351d",
    "Högskolan Kristianstad":                        "#00351d",
    "Sveriges lantbruksuniversitet":                 "#00351d",
    "Mälardalens universitet":                       "#00351d",

    # Gul
    "Ericastiftelsen":                               "#f1d001",
    "Karlstads universitet":                         "#f1d001",
    "Linnéuniversitetet":                            "#f1d001",
    "Högskolan i Gävle":                             "#f1d001",
    "Södertörns högskola":                           "#f1d001",
    "Marie Cederschiöld högskola":                   "#f1d001",
    "Enskilda Högskolan Stockholm":                  "#f1d001",
}

# 2. Build a choices tuple for the CharField
SCHOOL_CHOICES = [
    (name, name) for name in SCHOOL_COLORS.keys()
]


class CustomUser(AbstractUser):
    PRONOUN_CHOICES = [
        ('she/her', 'She/Her'),
        ('he/him', 'He/Him'),
    ]

    first_name = models.CharField(max_length=30, blank=True)
    last_name = models.CharField(max_length=30, blank=True)
    pronoun = models.CharField(max_length=10, choices=PRONOUN_CHOICES, blank=True)
    location = models.CharField(max_length=255, blank=True)
    programe = models.CharField(max_length=50, blank=True)
    school = models.CharField(max_length=255,
                              choices=SCHOOL_CHOICES,
                              blank=True)
    about = models.TextField(blank=True)
    details = models.JSONField(default=list, blank=True)
    interests = models.JSONField(default=list, blank=True)

    profile_picture = models.ImageField(upload_to='uploads/', blank=True, null=True)

    matches = models.ManyToManyField('self', symmetrical=False, related_name='matches_of')

    swipes = models.BigIntegerField(default=0)
    bookmarks = models.ManyToManyField('CustomUser', related_name='bookmarked_by', blank=True)

    groups = models.ManyToManyField(Group, related_name='customuser_set', blank=True)
    user_permissions = models.ManyToManyField(Permission, related_name='customuser_permissions_set', blank=True)

    groups = models.ManyToManyField(
        Group,
        related_name='customuser_set',  # Unique related_name
        blank=True,
        help_text='The groups this user belongs to.',
        verbose_name='groups',
    )
    user_permissions = models.ManyToManyField(
        Permission,
        related_name='customuser_permissions_set',  # Unique related_name
        blank=True,
        help_text='Specific permissions for this user.',
        verbose_name='user permissions',
    )

    @property
    def school_color(self):
        return SCHOOL_COLORS.get(self.school, "#000000")  # fallback if blank/invalid

class UserImage(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name="images")
    image = models.ImageField(upload_to='user_images/')
    uploaded_at = models.DateTimeField(auto_now_add=True)
    position = models.PositiveIntegerField(default=0)  # Field for sorting

    class Meta:
        ordering = ["position"]  # Ensures images are sorted by position
