import { AlertCircle, CheckCircle, Clock } from "lucide-react";

function getStatusIcon(status) {
  switch (status) {
    case "Published":
      return <CheckCircle className="h-4 w-4" />;
    case "Draft":
      return <Clock className="h-4 w-4" />;
    case "Review":
      return <AlertCircle className="h-4 w-4" />;
    default:
      return null;
  }
}

export default getStatusIcon;
