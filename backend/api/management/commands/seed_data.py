import random
import string
from datetime import datetime, timedelta
from django.core.management.base import BaseCommand
from django.utils import timezone
from api.models import Customer

class Command(BaseCommand):
    help = 'Seed the database with sample customer data'

    def add_arguments(self, parser):
        parser.add_argument(
            '--count',
            type=int,
            default=20,
            help='Number of customers to create (default: 20)'
        )
        parser.add_argument(
            '--clear',
            action='store_true',
            help='Clear existing customers before seeding'
        )

    def handle(self, *args, **options):
        count = options['count']
        clear = options['clear']

        if clear:
            self.stdout.write('Clearing existing customers...')
            Customer.objects.all().delete()
            self.stdout.write(self.style.SUCCESS('Successfully cleared all customers'))

        self.stdout.write(f'Creating {count} sample customers...')
        
        # Sample data pools
        first_names = [
            'James', 'Mary', 'John', 'Patricia', 'Robert', 'Jennifer', 'Michael', 'Linda',
            'William', 'Elizabeth', 'David', 'Barbara', 'Richard', 'Susan', 'Joseph', 'Jessica',
            'Thomas', 'Sarah', 'Charles', 'Karen', 'Christopher', 'Nancy', 'Daniel', 'Lisa',
            'Matthew', 'Betty', 'Anthony', 'Margaret', 'Mark', 'Sandra', 'Donald', 'Ashley',
            'Steven', 'Dorothy', 'Paul', 'Kimberly', 'Andrew', 'Donna', 'Joshua', 'Emily',
            'Kenneth', 'Carol', 'Kevin', 'Michelle', 'Brian', 'Amanda', 'George', 'Melissa',
            'Timothy', 'Deborah', 'Ronald', 'Stephanie', 'Edward', 'Rebecca', 'Jason', 'Sharon',
            'Jeffrey', 'Laura', 'Ryan', 'Cynthia', 'Jacob', 'Kathleen', 'Gary', 'Amy',
            'Nicholas', 'Angela', 'Eric', 'Shirley', 'Jonathan', 'Anna', 'Stephen', 'Ruth',
            'Larry', 'Emma', 'Justin', 'Carolyn', 'Scott', 'Janet', 'Brandon', 'Loretta',
            'Benjamin', 'Tracy', 'Samuel', 'Beatrice', 'Raymond', 'Sabrina', 'Gregory', 'Martha',
            'Frank', 'Diana', 'Patrick', 'Evelyn', 'Alexander', 'Megan', 'Jack', 'Andrea',
            'Dennis', 'Hannah', 'Jerry', 'Olivia', 'Tyler', 'Natalie', 'Aaron', 'Alyssa'
        ]
        
        last_names = [
            'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis',
            'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson',
            'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin', 'Lee', 'Perez', 'Thompson',
            'White', 'Harris', 'Sanchez', 'Clark', 'Ramirez', 'Lewis', 'Robinson', 'Walker',
            'Young', 'Allen', 'King', 'Wright', 'Scott', 'Torres', 'Nguyen', 'Hill',
            'Flores', 'Green', 'Adams', 'Nelson', 'Baker', 'Hall', 'Rivera', 'Campbell',
            'Mitchell', 'Carter', 'Roberts', 'Turner', 'Phillips', 'Evans', 'Collins', 'Edwards',
            'Stewart', 'Morris', 'Murphy', 'Cook', 'Rogers', 'Morgan', 'Peterson', 'Cooper',
            'Reed', 'Bailey', 'Bell', 'Howard', 'Ward', 'Cox', 'Diaz', 'Richardson',
            'Wood', 'Watson', 'Brooks', 'Bennett', 'Gray', 'James', 'Reyes', 'Cruz',
            'Hughes', 'Price', 'Myers', 'Long', 'Foster', 'Sanders', 'Ross', 'Powell',
            'Sullivan', 'Russell', 'Ortiz', 'Jenkins', 'Perry', 'Butler', 'Barnes', 'Fisher'
        ]
        
        domains = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'company.com', 
                   'business.com', 'enterprise.com', 'techcorp.com', 'global.com', 'solutions.com']
        
        id_prefixes = ['ID', 'PAS', 'NID', 'DRV', 'CIT']

        customers_created = 0
        errors = 0

        for i in range(count):
            try:
                first_name = random.choice(first_names)
                last_name = random.choice(last_names)
                
                # Generate unique email
                email = f"{first_name.lower()}.{last_name.lower()}{random.randint(1, 999)}@{random.choice(domains)}"
                
                # Generate DOB (18-65 years ago)
                years_ago = random.randint(18, 65)
                dob = timezone.now().date() - timedelta(days=years_ago * 365 + random.randint(0, 365))
                
                # Generate ID number
                id_number = f"{random.choice(id_prefixes)}{random.randint(100000, 999999)}"
                
                # Generate account balance (0 to 100,000)
                account_balance = round(random.uniform(0, 100000), 2)
                
                # Create customer
                customer = Customer.objects.create(
                    email=email,
                    first_name=first_name,
                    last_name=last_name,
                    dob=dob,
                    id_number=id_number,
                    account_balance=account_balance
                )
                
                customers_created += 1
                
                if customers_created % 5 == 0:
                    self.stdout.write(f'Created {customers_created} customers...')
                    
            except Exception as e:
                errors += 1
                self.stdout.write(self.style.WARNING(f'Error creating customer {i+1}: {str(e)}'))
                continue

        # Summary
        self.stdout.write('')
        self.stdout.write(self.style.SUCCESS('=' * 50))
        self.stdout.write(self.style.SUCCESS('SEEDING COMPLETE'))
        self.stdout.write(self.style.SUCCESS('=' * 50))
        self.stdout.write(f'Total customers created: {customers_created}')
        self.stdout.write(f'Total customers in database: {Customer.objects.count()}')
        self.stdout.write(f'Errors encountered: {errors}')
        self.stdout.write('=' * 50)
        
        # Display sample of created customers
        if customers_created > 0:
            self.stdout.write('')
            self.stdout.write('Sample customers created:')
            sample_customers = Customer.objects.all()[:5]
            for customer in sample_customers:
                self.stdout.write(
                    f'  • {customer.first_name} {customer.last_name} '
                    f'(Account: {customer.account_number}) - '
                    f'${customer.account_balance:,.2f}'
                )
            self.stdout.write('')