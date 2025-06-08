import OfficeRegistrationWizard from '../../../office-registration-wizard'
import { Header } from "../../../components/header"

export default function OfficeRegisterPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="md:mr-80">
        <OfficeRegistrationWizard />
      </div>
    </div>
  )
} 