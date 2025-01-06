// components/auth/RegisterForm.tsx
import { useState } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import { toast } from 'sonner';

export function RegisterForm() {
 const [email, setEmail] = useState('');
 const [password, setPassword] = useState('');
 const register = useAuthStore(state => state.register);

 const handleSubmit = async (e: React.FormEvent) => {
   e.preventDefault();
   try {
     await register(email, password);
     toast.success('Registration successful');
   } catch (error) {
     toast.error('Registration failed');
   }
 };

 return (
   <form onSubmit={handleSubmit} className="space-y-4">
     <div>
       <label className="block text-sm font-medium text-white">Email</label>
       <input
         type="email"
         value={email}
         onChange={(e) => setEmail(e.target.value)}
         className="w-full p-2 bg-slate-800 border border-slate-700 rounded-md"
         required
       />
     </div>
     <div>
       <label className="block text-sm font-medium text-white">Password</label>
       <input
         type="password"
         value={password}
         onChange={(e) => setPassword(e.target.value)}
         className="w-full p-2 bg-slate-800 border border-slate-700 rounded-md"
         required
       />
     </div>
     <button
       type="submit"
       className="w-full py-2 bg-blue-600 hover:bg-blue-700 rounded-md text-white"
     >
       Register
     </button>
   </form>
 );
}