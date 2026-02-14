from django.core.management.base import BaseCommand
from dental.models import Dentist, Service


SERVICES_DATA = [
    {
        'name': 'General Dentistry',
        'slug': 'general-dentistry',
        'short_description': 'Comprehensive oral health care and routine checkups.',
        'description': 'Our general dentistry services cover routine checkups, cleanings, fillings, and preventive care to maintain your oral health.',
        'benefits': 'Prevention of cavities and gum disease\nEarly detection of issues\nPersonalized care plans\nLong-term oral health',
        'experience_highlight': 'Over 20 years of experience in comprehensive dental care.',
        'icon': 'general',
        'order': 1,
    },
    {
        'name': 'Teeth Cleaning & Polishing',
        'slug': 'teeth-cleaning-polishing',
        'short_description': 'Professional cleaning to remove plaque and tartar.',
        'description': 'Professional teeth cleaning and polishing to remove plaque, tartar, and surface stains for a healthier, brighter smile.',
        'benefits': 'Prevents gum disease\nRemoves stubborn stains\nFresher breath\nBrighter smile',
        'experience_highlight': 'Thousands of successful cleanings performed with gentle, effective techniques.',
        'icon': 'cleaning',
        'order': 2,
    },
    {
        'name': 'Root Canal Treatment',
        'slug': 'root-canal-treatment',
        'short_description': 'Save infected teeth with comfortable root canal therapy.',
        'description': 'Root canal treatment saves severely infected or damaged teeth by removing the infected pulp and sealing the tooth.',
        'benefits': 'Saves your natural tooth\nRelieves pain\nPrevents spread of infection\nLong-lasting results',
        'experience_highlight': 'Expert in pain-free root canal procedures with modern techniques.',
        'icon': 'root-canal',
        'order': 3,
    },
    {
        'name': 'Tooth Extraction',
        'slug': 'tooth-extraction',
        'short_description': 'Safe and gentle tooth removal when necessary.',
        'description': 'When a tooth cannot be saved, we perform safe, comfortable extractions with proper aftercare guidance.',
        'benefits': 'Relief from severe pain\nPrevents infection spread\nPreparation for implants or dentures\nMinimal discomfort',
        'experience_highlight': 'Years of experience in simple and surgical extractions.',
        'icon': 'extraction',
        'order': 4,
    },
    {
        'name': 'Dental Implants',
        'slug': 'dental-implants',
        'short_description': 'Permanent tooth replacement that looks and feels natural.',
        'description': 'Dental implants provide a permanent solution for missing teeth, restoring function and aesthetics with natural-looking results.',
        'benefits': 'Permanent solution\nNatural look and feel\nPreserves jawbone\nNo slipping or discomfort',
        'experience_highlight': 'Extensive experience in implant placement and restoration.',
        'icon': 'implants',
        'order': 5,
    },
    {
        'name': 'Braces & Orthodontics',
        'slug': 'braces-orthodontics',
        'short_description': 'Straighten teeth and correct bite for a confident smile.',
        'description': 'We offer traditional braces and modern orthodontic options to straighten teeth and correct bite issues for all ages.',
        'benefits': 'Improved alignment\nBetter oral health\nEnhanced confidence\nCustomized treatment plans',
        'experience_highlight': 'Two decades of creating beautiful, straight smiles.',
        'icon': 'orthodontics',
        'order': 6,
    },
    {
        'name': 'Teeth Whitening',
        'slug': 'teeth-whitening',
        'short_description': 'Professional whitening for a brighter, more confident smile.',
        'description': 'Safe and effective professional teeth whitening to remove stains and brighten your smile by several shades.',
        'benefits': 'Dramatic results\nSafe for enamel\nLong-lasting brightness\nBoost in confidence',
        'experience_highlight': 'Proven whitening protocols for safe, stunning results.',
        'icon': 'whitening',
        'order': 7,
    },
    {
        'name': 'Cosmetic Dentistry',
        'slug': 'cosmetic-dentistry',
        'short_description': 'Veneers, bonding, and smile makeovers.',
        'description': 'Transform your smile with veneers, bonding, contouring, and full smile makeovers tailored to your goals.',
        'benefits': 'Customized smile design\nNatural-looking results\nCorrects chips and gaps\nQuick transformations',
        'experience_highlight': '20+ years of cosmetic dentistry and smile design.',
        'icon': 'cosmetic',
        'order': 8,
    },
    {
        'name': 'Pediatric Dentistry',
        'slug': 'pediatric-dentistry',
        'short_description': 'Gentle, friendly dental care for children.',
        'description': 'We provide a welcoming environment for young patients, focusing on prevention and positive dental experiences.',
        'benefits': 'Child-friendly environment\nPreventive care\nBuilds healthy habits\nReduces dental anxiety',
        'experience_highlight': 'Dedicated to making children feel comfortable and safe.',
        'icon': 'pediatric',
        'order': 9,
    },
    {
        'name': 'Gum Treatment',
        'slug': 'gum-treatment',
        'short_description': 'Prevention and treatment of gum disease.',
        'description': 'Comprehensive gum care including scaling, root planing, and treatment for gingivitis and periodontitis.',
        'benefits': 'Stops gum disease progression\nReduces inflammation\nProtects tooth support\nImproves overall health',
        'experience_highlight': 'Expert in non-surgical and surgical gum therapy.',
        'icon': 'gum',
        'order': 10,
    },
]


class Command(BaseCommand):
    help = 'Seeds the database with default dentist profile and services'

    def handle(self, *args, **options):
        if not Dentist.objects.exists():
            Dentist.objects.create(
                name='Dr. James Mitchell',
                title='DDS, General & Cosmetic Dentist',
                bio='With over 20 years of experience, Dr. James Mitchell is committed to providing exceptional dental care in a comfortable, patient-centered environment. He believes in building lasting relationships with patients and tailoring treatment to each individual\'s needs.',
                experience_years=20,
                philosophy='Our philosophy is simple: put the patient first. We combine advanced technology with a gentle, compassionate approach to ensure every visit is positive. From preventive care to complex procedures, we are here to support your oral health journey.',
                certifications='Doctor of Dental Surgery (DDS)\nMember, American Dental Association\nCertified in Advanced Cosmetic Dentistry\nContinuing Education in Implantology',
            )
            self.stdout.write(self.style.SUCCESS('Created default dentist profile.'))
        else:
            self.stdout.write('Dentist profile already exists.')

        created = 0
        for data in SERVICES_DATA:
            _, was_created = Service.objects.get_or_create(
                slug=data['slug'],
                defaults=data
            )
            if was_created:
                created += 1

        self.stdout.write(self.style.SUCCESS(f'Services: {created} new, {len(SERVICES_DATA) - created} already existed.'))
