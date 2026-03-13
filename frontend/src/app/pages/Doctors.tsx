import { useState, useEffect } from "react";
import { Search, Star, Award, Calendar } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Badge } from "../components/ui/badge";
import { toast } from "sonner";

type Doctor = {
  id: string;
  name: string;
  specialization: string;
  experience: number;
  rating: number;
  totalReviews: number;
  description: string;
  image: string;
  availableToday: boolean;
};

// const doctors: Doctor[] = [
//   {
//     id: "1",
//     name: "Dr. Sarah Johnson",
//     specialization: "General Dentist",
//     experience: 15,
//     rating: 4.9,
//     totalReviews: 234,
//     description:
//       "Specializes in comprehensive dental care with a gentle approach. Expert in preventive dentistry and cosmetic procedures.",
//     image: "SJ",
//     availableToday: true,
//   },
//   {
//     id: "2",
//     name: "Dr. Michael Chen",
//     specialization: "Orthodontist",
//     experience: 12,
//     rating: 4.8,
//     totalReviews: 189,
//     description:
//       "Board-certified orthodontist specializing in braces, Invisalign, and jaw alignment. Dedicated to creating beautiful smiles.",
//     image: "MC",
//     availableToday: true,
//   },
//   {
//     id: "3",
//     name: "Dr. Emily Rodriguez",
//     specialization: "Oral Surgeon",
//     experience: 18,
//     rating: 5.0,
//     totalReviews: 312,
//     description:
//       "Expert in complex extractions, dental implants, and corrective jaw surgery. Known for exceptional patient care.",
//     image: "ER",
//     availableToday: false,
//   },
//   {
//     id: "4",
//     name: "Dr. James Wilson",
//     specialization: "Cosmetic Dentist",
//     experience: 10,
//     rating: 4.7,
//     totalReviews: 156,
//     description:
//       "Passionate about smile makeovers, veneers, and teeth whitening. Combines artistry with advanced dental techniques.",
//     image: "JW",
//     availableToday: true,
//   },
//   {
//     id: "5",
//     name: "Dr. Lisa Anderson",
//     specialization: "Pediatric Dentist",
//     experience: 14,
//     rating: 4.9,
//     totalReviews: 278,
//     description:
//       "Specialized in children's dental care. Creates a fun, comfortable environment for young patients and families.",
//     image: "LA",
//     availableToday: true,
//   },
//   {
//     id: "6",
//     name: "Dr. David Kim",
//     specialization: "Emergency Dentist",
//     experience: 16,
//     rating: 4.8,
//     totalReviews: 201,
//     description:
//       "Available for urgent dental care. Expert in handling dental emergencies, trauma, and pain management.",
//     image: "DK",
//     availableToday: true,
//   },
//   {
//     id: "7",
//     name: "Dr. Maria Garcia",
//     specialization: "Prosthodontist",
//     experience: 13,
//     rating: 4.9,
//     totalReviews: 167,
//     description:
//       "Specializes in dental prosthetics, crowns, bridges, and dentures. Restores function and aesthetics to smiles.",
//     image: "MG",
//     availableToday: false,
//   },
//   {
//     id: "8",
//     name: "Dr. Robert Taylor",
//     specialization: "Periodontist",
//     experience: 11,
//     rating: 4.7,
//     totalReviews: 143,
//     description:
//       "Expert in gum disease treatment and prevention. Specializes in dental implants and gum grafting procedures.",
//     image: "RT",
//     availableToday: true,
//   },
// ];

export function Doctors() {
    const [doctors, setDoctors] = useState<Doctor[]>([]);
    const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSpecialization, setSelectedSpecialization] = useState<
    string | null
  >(null);
    useEffect(() => {
  const fetchDoctors = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/doctors");
      const data = await response.json();
      setDoctors(data);
    } catch (error) {
      console.error("Error fetching doctors:", error);
      toast.error("Failed to load doctors");
    } finally {
      setLoading(false);
    }
  };

  fetchDoctors();
}, []);
  const specializations = Array.from(
    new Set(doctors.map((d) => d.specialization))
  );

  const filteredDoctors = doctors.filter((doctor) => {
    const matchesSearch =
      doctor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doctor.specialization.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSpecialization =
      !selectedSpecialization ||
      doctor.specialization === selectedSpecialization;
    return matchesSearch && matchesSpecialization;
  });

  const handleViewSlots = (doctor: Doctor) => {
    toast.info(`Viewing availability for ${doctor.name}`, {
      description: "Redirecting to booking page...",
    });
  };
    if (loading) {
  return (
    <div className="p-6 text-center text-slate-600">
      Loading doctors...
    </div>
  );
}
  return (

    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-slate-900 mb-2">
          Our Doctors
        </h1>
        <p className="text-slate-600">
          Meet our experienced team of dental professionals
        </p>
      </div>

      {/* Search and Filter */}
      <div className="mb-6 space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
          <Input
            type="text"
            placeholder="Search by name or specialization..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          <Button
            variant={selectedSpecialization === null ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedSpecialization(null)}
            className={
              selectedSpecialization === null
                ? "bg-blue-600 hover:bg-blue-700"
                : ""
            }
          >
            All Specializations
          </Button>
          {specializations.map((spec) => (
            <Button
              key={spec}
              variant={selectedSpecialization === spec ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedSpecialization(spec)}
              className={
                selectedSpecialization === spec
                  ? "bg-blue-600 hover:bg-blue-700"
                  : ""
              }
            >
              {spec}
            </Button>
          ))}
        </div>
      </div>

      {/* Results Count */}
      <div className="mb-4">
        <p className="text-sm text-slate-600">
          Showing {filteredDoctors.length} of {doctors.length} doctors
        </p>
      </div>

      {/* Doctors Grid */}
      {filteredDoctors.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDoctors.map((doctor) => (
            <Card
              key={doctor.id}
              className="p-6 hover:shadow-lg transition-shadow"
            >
              {/* Doctor Header */}
              <div className="flex items-start gap-4 mb-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white text-xl font-semibold flex-shrink-0">
                  {doctor.image}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-slate-900 mb-1">
                    {doctor.name}
                  </h3>
                  <p className="text-sm text-slate-600 mb-2">
                    {doctor.specialization}
                  </p>
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-1 text-amber-600">
                      <Star className="w-4 h-4 fill-current" />
                      <span className="font-medium">{doctor.rating}</span>
                      <span className="text-slate-400">
                        ({doctor.totalReviews})
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-slate-600">
                      <Award className="w-4 h-4" />
                      <span>{doctor.experience}y exp</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Description */}
              <p className="text-sm text-slate-600 mb-4 line-clamp-3">
                {doctor.description}
              </p>

              {/* Availability Badge */}
              {doctor.availableToday && (
                <div className="mb-4">
                  <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-1.5" />
                    Available Today
                  </Badge>
                </div>
              )}

              {/* Actions */}
              <Button
                onClick={() => handleViewSlots(doctor)}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Calendar className="w-4 h-4 mr-2" />
                View Available Slots
              </Button>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="p-12 text-center">
          <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4">
            <Search className="w-8 h-8 text-slate-400" />
          </div>
          <h3 className="font-medium text-slate-900 mb-2">No doctors found</h3>
          <p className="text-slate-500 mb-4">
            Try adjusting your search or filter criteria
          </p>
          <Button
            variant="outline"
            onClick={() => {
              setSearchQuery("");
              setSelectedSpecialization(null);
            }}
          >
            Clear Filters
          </Button>
        </Card>
      )}
    </div>
  );
}
