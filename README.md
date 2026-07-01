# Bank Customers MIS

A full-stack customer management information system for a bank, built with Django REST Framework on the backend and React (Vite) on the frontend.

## Tech Stack

**Backend**
- Django 5.0
- Django REST Framework
- SQLite (development)
- django-cors-headers

**Frontend**
- React 18 (Vite)
- React Router
- Axios
- Bootstrap 5
- react-hot-toast
- date-fns

## Project Structure

```
bank_customers_mis/
├── backend/
│   ├── manage.py
│   ├── bank_customers_mis/       # project settings, urls, wsgi
│   └── customers/                # app: models, serializers, views, urls
│       └── management/
│           └── commands/
│               └── seed_data.py
└── frontend/
    ├── src/
    │   ├── components/
    │   ├── pages/
    │   └── styles/
    └── .env
```

## Getting Started

### Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate      # Windows: venv\Scripts\activate

pip install -r requirements.txt

python manage.py makemigrations
python manage.py migrate
python manage.py createsuperuser   # optional
python manage.py seed_data --count 30 --clear   # optional sample data

python manage.py runserver
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

### URLs

- Frontend: http://localhost:5173
- API base: http://localhost:8000/api/v1/customers/
- Django admin: http://localhost:8000/admin/

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/v1/customers/` | List all customers |
| POST | `/api/v1/customers/` | Create a customer |
| GET | `/api/v1/customers/:id/` | Retrieve a customer |
| PUT | `/api/v1/customers/:id/` | Update a customer |
| PATCH | `/api/v1/customers/:id/balance/` | Update balance only |
| DELETE | `/api/v1/customers/:id/` | Delete a customer |

## Environment Variables

`frontend/.env`
```
VITE_API_URL=http://localhost:8000/api/v1
```

`backend/.env` (optional)
```
DJANGO_SECRET_KEY=your-secret-key-here
```

---

## Lessons Learned

Notes from building and debugging this project, written from a senior engineering perspective. These are the kinds of issues that are easy to introduce quickly and expensive to debug later, and the practices that would have prevented them.

### 1. A single missing comma can produce a misleading stack trace

The `ImproperlyConfigured: Field name 'account_numberaccount_balance' is not valid` error was not a logic bug — it was a Python syntax-level string concatenation. Two adjacent string literals with no comma between them (`'account_number'` followed by `'account_balance'` on the next line without a separating comma) get silently merged by Python into one string. DRF then reports a field that doesn't exist and never actually did.

Takeaway: when a serializer or model complains about a field name that looks like two real field names mashed together, stop looking at DRF's configuration and go straight to checking for a missing comma in the `fields` list. This class of error is invisible to the eye but obvious once you know the pattern.

### 2. Don't build a custom view path when a serializer already does the job

The original `CustomerBalanceUpdateView` tried to pass a nonstandard `fields=['account_balance']` keyword argument directly into `CustomerSerializer()`. `ModelSerializer` has no such constructor argument — restricting fields per-request is a legitimate but non-trivial DRF pattern, and bolting it on ad hoc is exactly how bugs like this one get introduced.

The fix that was arrived at — a dedicated `CustomerBalanceSerializer` with its own `Meta.fields = ['account_balance']` — is the correct approach. As a general rule: if an endpoint needs to expose a different subset of fields than the main resource serializer, give it its own serializer class rather than trying to parameterize the general one. It costs a few extra lines and saves a class of bugs where "temporary" flexibility silently breaks in production.

### 3. AI-generated (or quickly pasted) code needs the same review bar as hand-written code

This project was assembled from AI-generated snippets across multiple prompts. That's a legitimate way to bootstrap scaffolding, but the balance-update bug shipped because the generated view code was accepted without being run first. Two practices would have caught it immediately:
- Running `python manage.py check` after any model/serializer/view change, before touching the browser.
- Hitting the endpoint once with a REST client (curl, httpie, or DRF's browsable API) before wiring the frontend to it.

Treat generated code as a first draft from a junior contributor: fast to produce, still requires the same review discipline as everything else that goes into the codebase.

### 4. `__init__.py` files are easy to lose in copy-paste instructions

The setup notes for `management/__init__.py` and `management/commands/__init__.py` were rendered as `init.py` (missing the double underscores) in the generated instructions. If copied literally, Django will not recognize `management` as a Python package and the custom `seed_data` command will fail to register, with an error that doesn't obviously point back to a missing dunder file.

Takeaway: any time instructions reference `__init__.py`, verify the actual filename on disk rather than trusting rendered text, since underscores are a common casualty of formatting and transcription.

### 5. Auto-generated identifiers need a uniqueness safeguard, not just a default

`account_number` is generated by `random.choices` over a 6-character alphanumeric space with a `unique=True` constraint but no retry logic. At low volumes (tens of customers) a collision is unlikely; at production scale it is a matter of when, not if, and the failure mode is an unhandled `IntegrityError` on customer creation.

The correct long-term fix is a generation loop that retries on collision (or a query to check existence before returning the value), not a larger character space alone — a larger space lowers the probability but doesn't remove the race condition between two concurrent requests generating the same number.

### 6. Environment-specific settings should never default to something that works too well in dev

`DEBUG = True` and a hardcoded fallback `SECRET_KEY` in `settings.py` are fine for local development but are exactly the kind of default that quietly ships to production if nobody remembers to override them. A senior-level habit here is to make the insecure default fail loudly rather than work quietly — for example, raising on missing `DJANGO_SECRET_KEY` in any environment where `DEBUG` is not explicitly set to `True`.

### 7. CORS and API base URLs are a recurring source of "it works on my machine"

`CORS_ALLOWED_ORIGINS` and `VITE_API_URL` are hardcoded to `localhost` ports on both ends. This is appropriate for local development but is worth flagging early as a piece of configuration that must move to environment-driven values before any deployment — not something to patch under time pressure the first time staging breaks.

### Summary

Most of the friction in this project came from small, mechanical issues — a missing comma, a nonstandard constructor argument, a mistyped filename — rather than from architectural decisions. The architecture (DRF generic views, a thin Axios API layer, page-per-route React components) is sound and appropriate for the size of the problem. The recurring lesson is that scaffolding generated quickly, whether by hand or by an AI assistant, still needs to be run and verified before it is trusted, and that small syntax-level mistakes tend to disguise themselves as configuration or logic errors in the stack trace.