import { useState, useEffect } from "react";
import {
  Calendar,
  Clock,
  User,
  MoreVertical,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../components/ui/alert-dialog";
import { toast } from "sonner";

type Appointment = {
  id: string;
  date: string;
  time: string;
  doctor: string;
  specialization: string;
  status: "upcoming" | "completed" | "cancelled";
  type: string;
};



export function MyAppointments() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  useEffect(() => {
  fetch("http://127.0.0.1:5000/api/appointments")
    .then((res) => res.json())
    .then((data) => {
      const formatted = data.map((apt: any) => ({
        id: String(apt.id),
        doctor: apt.doctor,
        specialization: apt.specialization,
        date: new Date(apt.appointment_date).toLocaleDateString("en-US", {
          month: "long",
          day: "numeric",
          year: "numeric",
        }),
        time: apt.appointment_time,
        type: apt.type,
        status: apt.status,
      }));

      setAppointments(formatted);
    })
    .catch((err) => console.error("Error fetching appointments:", err));
}, []);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<string | null>(
    null
  );

  const upcomingAppointments = appointments.filter(
    (apt) => apt.status === "upcoming"
  );
  const pastAppointments = appointments.filter(
    (apt) => apt.status === "completed"
  );

  const handleCancelClick = (id: string) => {
    setSelectedAppointment(id);
    setCancelDialogOpen(true);
  };

  const handleCancelConfirm = () => {
    if (selectedAppointment) {
      setAppointments((prev) =>
        prev.map((apt) =>
          apt.id === selectedAppointment
            ? { ...apt, status: "cancelled" as const }
            : apt
        )
      );
      toast.success("Appointment cancelled successfully");
      setCancelDialogOpen(false);
      setSelectedAppointment(null);
    }
  };

  const handleReschedule = (id: string) => {
    const appointment = appointments.find((apt) => apt.id === id);
    toast.info("Reschedule feature coming soon!", {
      description: `You're rescheduling with ${appointment?.doctor}`,
    });
  };

  const handleViewDetails = (id: string) => {
    const appointment = appointments.find((apt) => apt.id === id);
    toast.info("Appointment Details", {
      description: `${appointment?.type} with ${appointment?.doctor} on ${appointment?.date}`,
    });
  };

  const AppointmentCard = ({ appointment }: { appointment: Appointment }) => (
    <Card className="p-5 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-3">
            <Badge
              variant={
                appointment.status === "upcoming" ? "default" : "secondary"
              }
              className={
                appointment.status === "upcoming"
                  ? "bg-blue-600"
                  : "bg-slate-400"
              }
            >
              {appointment.status === "upcoming" ? (
                <CheckCircle2 className="w-3 h-3 mr-1" />
              ) : null}
              {appointment.status === "upcoming" ? "Upcoming" : "Completed"}
            </Badge>
            <span className="text-sm text-slate-500">{appointment.type}</span>
          </div>

          <div className="space-y-2 mb-4">
            <div className="flex items-center gap-2 text-slate-700">
              <User className="w-4 h-4 text-slate-500" />
              <span className="font-medium">{appointment.doctor}</span>
              <span className="text-sm text-slate-500">
                • {appointment.specialization}
              </span>
            </div>

            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2 text-slate-600">
                <Calendar className="w-4 h-4 text-slate-500" />
                <span>{appointment.date}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-600">
                <Clock className="w-4 h-4 text-slate-500" />
                <span>{appointment.time}</span>
              </div>
            </div>
          </div>

          {appointment.status === "upcoming" && (
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleViewDetails(appointment.id)}
              >
                View Details
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleReschedule(appointment.id)}
              >
                Reschedule
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                onClick={() => handleCancelClick(appointment.id)}
              >
                Cancel
              </Button>
            </div>
          )}
        </div>

        {appointment.status === "upcoming" && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <MoreVertical className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleViewDetails(appointment.id)}>
                View Details
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleReschedule(appointment.id)}>
                Reschedule
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-red-600"
                onClick={() => handleCancelClick(appointment.id)}
              >
                Cancel Appointment
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </Card>
  );

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-slate-900 mb-2">
          My Appointments
        </h1>
        <p className="text-slate-600">
          View and manage your dental appointments
        </p>
      </div>

      {/* Upcoming Appointments */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-slate-900">
            Upcoming Appointments
          </h2>
          <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">
            {upcomingAppointments.length} scheduled
          </Badge>
        </div>

        {upcomingAppointments.length > 0 ? (
          <div className="grid md:grid-cols-2 gap-4">
            {upcomingAppointments.map((appointment) => (
              <AppointmentCard key={appointment.id} appointment={appointment} />
            ))}
          </div>
        ) : (
          <Card className="p-12 text-center">
            <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4">
              <Calendar className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="font-medium text-slate-900 mb-2">
              No upcoming appointments
            </h3>
            <p className="text-slate-500 mb-4">
              Book your next dental appointment to maintain your oral health
            </p>
            <Button className="bg-blue-600 hover:bg-blue-700">
              Book Appointment
            </Button>
          </Card>
        )}
      </div>

      {/* Past Appointments */}
      {pastAppointments.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-slate-900">
              Past Appointments
            </h2>
            <Badge variant="secondary" className="bg-slate-100 text-slate-700">
              {pastAppointments.length} completed
            </Badge>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {pastAppointments.map((appointment) => (
              <AppointmentCard key={appointment.id} appointment={appointment} />
            ))}
          </div>
        </div>
      )}

      {/* Cancel Confirmation Dialog */}
      <AlertDialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-red-600" />
              Cancel Appointment?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to cancel this appointment? This action
              cannot be undone. You can always book a new appointment later.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Keep Appointment</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleCancelConfirm}
              className="bg-red-600 hover:bg-red-700"
            >
              Yes, Cancel
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
