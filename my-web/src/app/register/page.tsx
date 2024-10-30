import RegisterForm from '@/components/auth/RegisterForm';
import Navbar from '../../components/layout/Navbar';

const RegisterPage: React.FC = () => {
    return (
        <div>
            <Navbar />
            <RegisterForm />
        </div>
    );
};

export default RegisterPage;
