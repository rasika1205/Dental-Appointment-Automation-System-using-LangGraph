import { useState, useEffect } from "react";
import { Calendar, Clock, CheckCircle2 } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { toast } from "sonner";

const specializations = [
  { id: "general", name: "General Dentist", icon: "🦷" },
  { id: "orthodontist", name: "Orthodontist", icon: "😁" },
  { id: "oral-surgeon", name: "Oral Surgeon", icon: "⚕️" },
  { id: "cosmetic", name: "Cosmetic Dentist", icon: "✨" },
  { id: "prosthodontist", name: "Prosthodontist", icon: "🔧" },
  { id: "pediatric", name: "Pediatric Dentist", icon: "👶" },
  { id: "emergency", name: "Emergency Dentist", icon: "🚨" },
];
type Doctor = {
  id: number;
  name: string;
  specialization: string;
  experience: number;
  image: string;
  rating?: number;
  totalReviews?: number;
};



const specializationMap = {
  general: "general_dentist",
  orthodontist: "orthodontist",
  "oral-surgeon": "oral_surgeon",
  cosmetic: "cosmetic_dentist",
  prosthodontist: "prosthodontist",
  pediatric: "pediatric_dentist",
  emergency: "emergency_dentist",
};
export function BookAppointment() {
    const [doctors, setDoctors] = useState<Doctor[]>([]);
    const [slots, setSlots] = useState<
  { slot_id: number; date: string; time: string }[]
>([]);
    useEffect(() => {
  fetchDoctors();
}, []);

const fetchDoctors = async () => {
  try {
    const res = await fetch("http://localhost:5000/api/doctors");
    const data = await res.json();
    console.log("Doctors API response:", data);

    setDoctors(data);

  } catch (err) {
    console.error("Error fetching doctors", err);
  }
};
  const [selectedSpecialization, setSelectedSpecialization] = useState<
    string | null
  >(null);
  const [selectedDoctor, setSelectedDoctor] = useState<number | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<{
  slot_id: number;
  date: string;
  time: string;
} | null>(null);

  const filteredDoctors = doctors.filter(
  (doc) =>
    selectedSpecialization &&
    doc.specialization === specializationMap[selectedSpecialization]
);

  const currentDoctor = doctors.find(
  (doc) => doc.id === Number(selectedDoctor)
);
useEffect(() => {
  if (!selectedDoctor) return;

  const fetchSlots = async () => {
    try {
      const doctor = doctors.find((d) => d.id === selectedDoctor);

      const res = await fetch(
        `http://localhost:5000/api/slots?doctor=${doctor?.name}`
      );

      const data = await res.json();

      if (data.success) {
        setSlots(data.slots);
      }
    } catch (err) {
      console.error("Error fetching slots", err);
    }
  };

  fetchSlots();
}, [selectedDoctor]);
  const handleConfirmAppointment = async () => {
  if (!selectedDoctor || !selectedSlot) return;

  const doctor = doctors.find((d) => d.id === selectedDoctor);

  try {
    const response = await fetch("http://localhost:5000/api/book", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
  slot_id: selectedSlot.slot_id
}),
    });

    const data = await response.json();

    if (data.success) {
      toast.success("Appointment Confirmed!", {
        description: `Your appointment with ${doctor?.name} on ${selectedSlot.date} at ${selectedSlot.time} has been confirmed.`,
      });

      setSelectedSpecialization(null);
      setSelectedDoctor(null);
      setSelectedSlot(null);
    } else {
      toast.error("Booking failed", {
        description: data.message,
      });
    }
  } catch (error) {
    toast.error("Server Error", {
      description: "Unable to book appointment.",
    });
  }
};
console.log("Booking slot:", selectedSlot);

console.log("Slots state:", slots);
  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-slate-900 mb-2">
          Book an Appointment
        </h1>
        <p className="text-slate-600">
          Choose a specialization, select a doctor, and pick your preferred
          time slot
        </p>
      </div>

      {/* Step 1: Specialization Selection */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-semibold">
            1
          </div>
          <h2 className="font-semibold text-slate-900">
            Select Specialization
          </h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3">
          {specializations.map((spec) => (
            <button
              key={spec.id}
              onClick={() => {
                setSelectedSpecialization(spec.id);
                setSelectedDoctor(null);
                setSelectedSlot(null);
              }}
              className={`p-4 rounded-xl border-2 transition-all text-center ${
                selectedSpecialization === spec.id
                  ? "border-blue-600 bg-blue-50"
                  : "border-slate-200 bg-white hover:border-blue-300 hover:bg-slate-50"
              }`}
            >
              <div className="text-3xl mb-2">{spec.icon}</div>
              <p className="text-sm font-medium text-slate-900">{spec.name}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Step 2: Doctor Selection */}
      {selectedSpecialization && (
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-semibold">
              2
            </div>
            <h2 className="font-semibold text-slate-900">Choose Doctor</h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredDoctors.map((doctor) => (
              <Card
                key={doctor.id}
                className={`p-5 cursor-pointer transition-all border-2 ${
                  selectedDoctor === doctor.id
                    ? "border-blue-600 shadow-md"
                    : "border-slate-200 hover:border-blue-300"
                }`}
                onClick={() => {
                  setSelectedDoctor(doctor.id);
                  setSelectedSlot(null);
                }}
              >
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-semibold">
                    {doctor.image}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-slate-900">
                      {doctor.name}
                    </h3>
                    <p className="text-sm text-slate-600 capitalize">
                      {specializations.find(
  (s) => specializationMap[s.id] === doctor.specialization
)?.name}
                    </p>
                    <div className="mt-2">
                      <Badge
                        variant="secondary"
                        className="bg-slate-100 text-slate-700"
                      >
                        {doctor.experience} years exp.
                      </Badge>
                    </div>
                  </div>
                  {selectedDoctor === doctor.id && (
                    <CheckCircle2 className="w-5 h-5 text-blue-600" />
                  )}
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Step 3: Slot Selection */}
      {selectedDoctor && (
  <div className="mb-8">
    <div className="flex items-center gap-2 mb-4">
      <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-semibold">
        3
      </div>
      <h2 className="font-semibold text-slate-900">
        Select Available Slot
      </h2>
    </div>

    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
  {slots.map((slot, index) => (
    <button
      key={slot.slot_id}
      onClick={() => setSelectedSlot(slot)}
      className={`p-3 rounded-lg border ${
        selectedSlot?.date === slot.date &&
        selectedSlot?.time === slot.time
          ? "border-blue-600 bg-blue-50"
          : "border-slate-200"
      }`}
    >
      <div className="text-sm font-medium">{slot.date}</div>
      <div className="text-xs text-slate-500">{slot.time}</div>
    </button>
  ))}
</div>
  </div>
)}

      {/* Confirmation */}
      {selectedSlot && (
        <div className="bg-gradient-to-br from-blue-50 to-teal-50 border-2 border-blue-200 rounded-xl p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h3 className="font-semibold text-slate-900 mb-2">
                Appointment Summary
              </h3>
              <div className="space-y-1 text-sm text-slate-700">
                <p>
                  <span className="font-medium">Doctor:</span>{" "}
                  {currentDoctor?.name}
                </p>
                <p>
                  <span className="font-medium">Date:</span>{" "}
                  {selectedSlot.date}
                </p>
                <p>
                  <span className="font-medium">Time:</span>{" "}
                  {selectedSlot.time}
                </p>
                <p>
                  <span className="font-medium">Specialization:</span>{" "}
                  {
                    specializations.find(
                      (s) => s.id === currentDoctor?.specialization
                    )?.name
                  }
                </p>
              </div>
            </div>
            <Button
              onClick={handleConfirmAppointment}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 text-base"
            >
              Confirm Appointment
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
