const { z } = require('zod');
const AppError = require('../utils/AppError');

const symptomSchema = z.object({
  symptoms: z.string().min(3, 'Please select at least one symptom or describe your problem'),
  age: z.coerce.number().optional(),
  gender: z.string().optional(),
  duration: z.string().optional(),
});

// Comprehensive symptom database with department suggestions
const symptomDatabase = [
  {
    keywords: ['chest pain', 'breathing problem', 'heart racing'],
    result: {
      condition: 'Cardiac / Respiratory Emergency',
      department: 'Cardiology',
      urgency: 'high',
      probability: 0.95,
      advice: '⚠️ IMMEDIATE ACTION REQUIRED: You are experiencing symptoms that could indicate a serious heart or lung issue.',
      recommendations: [
        'Call 102/108 or your local emergency number immediately',
        'Do not drive yourself to the hospital',
        'Loosen tight clothing and try to stay calm',
        'Chew an aspirin if available and not allergic'
      ]
    }
  },
  {
    keywords: ['fever', 'cough', 'sore throat', 'cold'],
    result: {
      condition: 'Viral Respiratory Infection',
      department: 'General Medicine',
      urgency: 'medium',
      probability: 0.88,
      advice: 'Your symptoms are consistent with a viral infection or the flu.',
      recommendations: [
        'Stay hydrated with warm fluids and ORS',
        'Monitor temperature every 4 hours',
        'Take steam inhalation for congestion',
        'Consult a General Physician for medication'
      ]
    }
  },
  {
    keywords: ['stomach pain', 'vomiting', 'nausea'],
    result: {
      condition: 'Acute Gastritis / Food Poisoning',
      department: 'Gastroenterology',
      urgency: 'medium',
      probability: 0.82,
      advice: 'The pain and vomiting suggest an irritation of the digestive tract.',
      recommendations: [
        'Avoid solid foods for a few hours',
        'Sip small amounts of water/coconut water',
        'Check for signs of dehydration (dry mouth, dark urine)',
        'Consult a doctor if vomiting persists more than 6 hours'
      ]
    }
  },
  {
    keywords: ['headache', 'dizziness', 'weakness'],
    result: {
      condition: 'Tension Headache / Migraine / Dehydration',
      department: 'Neurology',
      urgency: 'low',
      probability: 0.70,
      advice: 'These symptoms are often caused by stress, lack of sleep, or dehydration.',
      recommendations: [
        'Rest in a dark, quiet room',
        'Increase water and electrolyte intake',
        'Reduce screen time and blue light exposure',
        'Consult a doctor if headache is sudden and "worst ever"'
      ]
    }
  },
  {
    keywords: ['body pain', 'fever', 'weakness'],
    result: {
      condition: 'Potential Viral Fever (Dengue/Malaria Risk)',
      department: 'General Medicine',
      urgency: 'medium',
      probability: 0.75,
      advice: 'Given the regional prevalence, body pain with fever should be monitored for vector-borne diseases.',
      recommendations: [
        'Get a complete blood count (CBC) test if fever lasts > 3 days',
        'Use mosquito nets and repellents',
        'Take only Paracetamol for pain (avoid Ibuprofen/Aspirin)',
        'Consult a doctor immediately if you notice red spots/bruising'
      ]
    }
  }
];

exports.analyze = async (req, res, next) => {
  try {
    const { symptoms: rawSymptoms, age, gender, duration } = symptomSchema.parse(req.body);
    const symptoms = rawSymptoms.toLowerCase();
    
    let bestMatch = null;
    let maxMatches = 0;

    // Find the entry with the most keyword matches
    symptomDatabase.forEach(entry => {
      const matchCount = entry.keywords.filter(kw => symptoms.includes(kw)).length;
      if (matchCount > maxMatches) {
        maxMatches = matchCount;
        bestMatch = entry.result;
      }
    });

    const prediction = bestMatch ? { ...bestMatch } : {
      condition: 'General Health Assessment Needed',
      department: 'General Medicine',
      urgency: 'low',
      probability: 0.40,
      advice: 'Your symptoms are non-specific and require a professional consultation for clarification.',
      recommendations: [
        'Keep a log of when symptoms occur',
        'Check for other signs like rashes or swelling',
        'Maintain a healthy diet and sleep schedule',
        'Schedule a routine check-up'
      ]
    };

    // Age-based urgency escalation
    if ((age > 60 || age < 5) && prediction.urgency === 'low') {
      prediction.urgency = 'medium';
    }
    if ((age > 60 || age < 5) && prediction.urgency === 'medium') {
      prediction.urgency = 'high';
    }

    // Critical symptom forced escalation
    if (symptoms.includes('chest pain') || symptoms.includes('breathing')) {
      prediction.urgency = 'high';
    }

    const finalResult = {
      ...prediction,
      nextSteps: prediction.urgency === 'high' 
        ? 'Please visit the nearest District Hospital emergency ward.' 
        : `Book an appointment with a ${prediction.department} specialist.`,
      disclaimer: 'This AI check is for informational purposes for RuralMed users and not a medical diagnosis.',
    };

    // Simulate AI processing delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    res.json({ success: true, data: finalResult });
  } catch (err) { next(err); }
};
