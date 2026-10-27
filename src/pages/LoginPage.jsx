import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Coffee, Eye, EyeOff, Lock, User, CheckCircle2 } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { toast } from 'sonner';

export function LoginPage() {
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('123456');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!username.trim() || !password) {
      setError('Iltimos, login va parolni kiriting');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      const result = login(username, password);
      setLoading(false);

      if (result.success) {
        toast.success('Tizimga muvaffaqiyatli kirdingiz!');
        navigate('/dashboard');
      } else {
        setError(result.message);
      }
    }, 300);
  };

  const handleFillDemo = () => {
    setUsername('admin');
    setPassword('123456');
    setError('');
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        {/* Logo */}
        <div className="mx-auto w-16 h-16 rounded-2xl bg-emerald-600 flex items-center justify-center text-white shadow-xl shadow-emerald-600/30 mb-4">
          <Coffee className="w-8 h-8" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Choyxona POS
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          Elektron buyurtma va hisob-kitob tizimi
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 shadow-xl shadow-slate-200/50 rounded-2xl border border-slate-200/80 sm:px-10">
          <form className="space-y-5" onSubmit={handleSubmit}>
            {error && (
              <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200/80 text-rose-700 text-xs font-medium">
                {error}
              </div>
            )}

            <div>
              <Input
                label="Login"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Loginni kiriting"
                icon={User}
                required
                autoFocus
              />
            </div>

            <div>
              <div className="relative">
                <Input
                  label="Parol"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Parolni kiriting"
                  icon={Lock}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-[34px] text-slate-400 hover:text-slate-600 focus:outline-none cursor-pointer p-1"
                  title={showPassword ? 'Parolni yashirish' : 'Parolni ko‘rsatish'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Demo credentials hint box */}
            <div className="p-3 bg-emerald-50/70 border border-emerald-200/60 rounded-xl text-xs text-emerald-800">
              <div className="flex items-center justify-between mb-1">
                <span className="font-semibold flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Demo ma’lumotlar:
                </span>
                <button
                  type="button"
                  onClick={handleFillDemo}
                  className="text-emerald-700 font-bold underline hover:text-emerald-900 cursor-pointer text-[11px]"
                >
                  To‘ldirish
                </button>
              </div>
              <div className="text-[11px] text-emerald-700 font-mono">
                Login: <span className="font-bold">admin</span> | Parol: <span className="font-bold">123456</span>
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              loading={loading}
              className="w-full shadow-md shadow-emerald-600/20"
            >
              Tizimga kirish
            </Button>
          </form>
        </div>

        <p className="mt-6 text-center text-xs text-slate-400">
          Choyxona POS © {new Date().getFullYear()}. Barcha huquqlar himoyalangan.
        </p>
      </div>
    </div>
  );
}
