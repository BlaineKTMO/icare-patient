from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from datetime import datetime

app = Flask(__name__)
CORS(app)

# Database configuration
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///patients.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

# Patient Model
class Patient(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    age = db.Column(db.Integer)
    phone = db.Column(db.String(20))
    email = db.Column(db.String(120))
    address = db.Column(db.String(200))
    blood_type = db.Column(db.String(5))
    height = db.Column(db.String(10))
    weight = db.Column(db.String(10))
    last_checkup = db.Column(db.DateTime)
    conditions = db.Column(db.String(500))  # Stored as comma-separated values
    medications = db.Column(db.String(500))  # Stored as comma-separated values
    dietary_restrictions = db.Column(db.String(500))  # Stored as comma-separated values
    emergency_contact_name = db.Column(db.String(100))
    emergency_contact_relationship = db.Column(db.String(50))
    emergency_contact_phone = db.Column(db.String(20))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'age': self.age,
            'phone': self.phone,
            'email': self.email,
            'address': self.address,
            'blood_type': self.blood_type,
            'height': self.height,
            'weight': self.weight,
            'last_checkup': self.last_checkup.isoformat() if self.last_checkup else None,
            'conditions': self.conditions.split(',') if self.conditions else [],
            'medications': self.medications.split(',') if self.medications else [],
            'dietary_restrictions': self.dietary_restrictions.split(',') if self.dietary_restrictions else [],
            'emergency_contact': {
                'name': self.emergency_contact_name,
                'relationship': self.emergency_contact_relationship,
                'phone': self.emergency_contact_phone
            },
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat()
        }

# Create all tables
with app.app_context():
    db.create_all()

# CRUD Operations

# Create a new patient
@app.route('/api/patients', methods=['POST'])
def create_patient():
    data = request.json
    
    # Convert lists to comma-separated strings
    conditions = ','.join(data.get('conditions', []))
    medications = ','.join(data.get('medications', []))
    dietary_restrictions = ','.join(data.get('dietary_restrictions', []))
    
    # Parse last_checkup date if provided
    last_checkup = datetime.fromisoformat(data['last_checkup']) if data.get('last_checkup') else None
    
    new_patient = Patient(
        name=data['name'],
        age=data.get('age'),
        phone=data.get('phone'),
        email=data.get('email'),
        address=data.get('address'),
        blood_type=data.get('blood_type'),
        height=data.get('height'),
        weight=data.get('weight'),
        last_checkup=last_checkup,
        conditions=conditions,
        medications=medications,
        dietary_restrictions=dietary_restrictions,
        emergency_contact_name=data.get('emergency_contact', {}).get('name'),
        emergency_contact_relationship=data.get('emergency_contact', {}).get('relationship'),
        emergency_contact_phone=data.get('emergency_contact', {}).get('phone')
    )
    
    db.session.add(new_patient)
    db.session.commit()
    
    return jsonify(new_patient.to_dict()), 201

# Get all patients
@app.route('/api/patients', methods=['GET'])
def get_patients():
    patients = Patient.query.all()
    return jsonify([patient.to_dict() for patient in patients])

# Get a single patient by ID
@app.route('/api/patients/<int:patient_id>', methods=['GET'])
def get_patient(patient_id):
    patient = Patient.query.get_or_404(patient_id)
    return jsonify(patient.to_dict())

# Update a patient
@app.route('/api/patients/<int:patient_id>', methods=['PUT'])
def update_patient(patient_id):
    patient = Patient.query.get_or_404(patient_id)
    data = request.json
    
    # Convert lists to comma-separated strings
    conditions = ','.join(data.get('conditions', []))
    medications = ','.join(data.get('medications', []))
    dietary_restrictions = ','.join(data.get('dietary_restrictions', []))
    
    # Parse last_checkup date if provided
    last_checkup = datetime.fromisoformat(data['last_checkup']) if data.get('last_checkup') else patient.last_checkup
    
    patient.name = data.get('name', patient.name)
    patient.age = data.get('age', patient.age)
    patient.phone = data.get('phone', patient.phone)
    patient.email = data.get('email', patient.email)
    patient.address = data.get('address', patient.address)
    patient.blood_type = data.get('blood_type', patient.blood_type)
    patient.height = data.get('height', patient.height)
    patient.weight = data.get('weight', patient.weight)
    patient.last_checkup = last_checkup
    patient.conditions = conditions
    patient.medications = medications
    patient.dietary_restrictions = dietary_restrictions
    patient.emergency_contact_name = data.get('emergency_contact', {}).get('name', patient.emergency_contact_name)
    patient.emergency_contact_relationship = data.get('emergency_contact', {}).get('relationship', patient.emergency_contact_relationship)
    patient.emergency_contact_phone = data.get('emergency_contact', {}).get('phone', patient.emergency_contact_phone)
    
    db.session.commit()
    return jsonify(patient.to_dict())

# Delete a patient
@app.route('/api/patients/<int:patient_id>', methods=['DELETE'])
def delete_patient(patient_id):
    patient = Patient.query.get_or_404(patient_id)
    db.session.delete(patient)
    db.session.commit()
    return '', 204

if __name__ == '__main__':
    app.run(debug=True) 