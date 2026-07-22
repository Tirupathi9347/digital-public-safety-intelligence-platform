import { Router } from "express";
import { geoIncidents } from "../data/incidentsData";

const router = Router();

// GET Geospatial Incidents
router.get("/geospatial-data", (req, res) => {
  res.json({ incidents: geoIncidents });
});

// DISPATCH alert / unit simulation
router.post("/dispatch-alert", (req, res) => {
  const { incidentId, assignedUnit } = req.body;
  const idx = geoIncidents.findIndex(inc => inc.id === incidentId);
  if (idx !== -1) {
    geoIncidents[idx].status = "DISPATCHED";
    geoIncidents[idx].assignedUnit = assignedUnit || "National Cyber Crime Unit";
    res.json({ success: true, updatedIncident: geoIncidents[idx] });
  } else {
    res.status(404).json({ error: "Incident not found" });
  }
});

// Citizen reports a new active scam / incident from the shield or main page
router.post("/report-incident", (req, res) => {
  const { type, title, location, details, involvedAmount, callerNumber } = req.body;
  
  const lat = 12 + Math.random() * 16;
  const lng = 72 + Math.random() * 16;

  const newIncident = {
    id: `INC-${100 + geoIncidents.length}`,
    type: type || 'digital_arrest',
    title: title || 'User Reported Scam Activity',
    location: location || 'Online / Intercept',
    coordinates: { lat, lng },
    severity: (type === 'digital_arrest') ? 'CRITICAL' : 'HIGH',
    timestamp: new Date().toISOString(),
    status: 'ACTIVE',
    details: details || 'No additional details provided by citizen.',
    involvedAmount: involvedAmount || '₹0',
    callerNumber: callerNumber || undefined,
    assignedUnit: 'Pending Assignment',
    isCitizenReport: true
  };

  geoIncidents.unshift(newIncident);
  res.json({ success: true, incident: newIncident });
});

export default router;
