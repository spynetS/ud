from django.core.management.base import BaseCommand
from profiles.models import School

class Command(BaseCommand):
    help = "Populates the database with predefined schools and colors"

    def handle(self, *args, **kwargs):
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

        for name, color in SCHOOL_COLORS.items():
            school, created = School.objects.get_or_create(name=name, defaults={'color': color})
            if created:
                self.stdout.write(self.style.SUCCESS(f'Created school: {name}'))
            else:
                self.stdout.write(f'School already exists: {name}')
