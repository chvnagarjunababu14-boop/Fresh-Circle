
-- Timestamp updater function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Role enum
CREATE TYPE public.app_role AS ENUM ('vendor', 'buyer', 'logistics', 'storage');

-- Profiles table
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  email TEXT,
  phone TEXT,
  role app_role NOT NULL DEFAULT 'buyer',
  business_name TEXT NOT NULL DEFAULT '',
  lat DOUBLE PRECISION,
  lng DOUBLE PRECISION,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view all profiles" ON public.profiles FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, email, phone, role, business_name)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.phone,
    COALESCE((NEW.raw_user_meta_data->>'role')::app_role, 'buyer'),
    COALESCE(NEW.raw_user_meta_data->>'business_name', '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Products table
CREATE TABLE public.products (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  vendor_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  emoji TEXT DEFAULT '🥬',
  qty_kg NUMERIC NOT NULL DEFAULT 0,
  price_per_kg NUMERIC NOT NULL DEFAULT 0,
  is_surplus BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view products" ON public.products FOR SELECT TO authenticated USING (true);
CREATE POLICY "Vendors can insert own products" ON public.products FOR INSERT TO authenticated
  WITH CHECK (vendor_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid()));
CREATE POLICY "Vendors can update own products" ON public.products FOR UPDATE TO authenticated
  USING (vendor_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid()));
CREATE POLICY "Vendors can delete own products" ON public.products FOR DELETE TO authenticated
  USING (vendor_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid()));

CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON public.products
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Requirements table
CREATE TABLE public.requirements (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  buyer_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  item_name TEXT NOT NULL,
  qty_needed NUMERIC NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'fulfilled')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.requirements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view requirements" ON public.requirements FOR SELECT TO authenticated USING (true);
CREATE POLICY "Buyers can insert own requirements" ON public.requirements FOR INSERT TO authenticated
  WITH CHECK (buyer_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid()));
CREATE POLICY "Buyers can update own requirements" ON public.requirements FOR UPDATE TO authenticated
  USING (buyer_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid()));

CREATE TRIGGER update_requirements_updated_at BEFORE UPDATE ON public.requirements
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Storage requests table
CREATE TABLE public.storage_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  vendor_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  qty NUMERIC NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'stored')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.storage_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view storage requests" ON public.storage_requests FOR SELECT TO authenticated USING (true);
CREATE POLICY "Vendors can insert own storage requests" ON public.storage_requests FOR INSERT TO authenticated
  WITH CHECK (vendor_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid()));
CREATE POLICY "Vendors can update own storage requests" ON public.storage_requests FOR UPDATE TO authenticated
  USING (vendor_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid()));

CREATE TRIGGER update_storage_requests_updated_at BEFORE UPDATE ON public.storage_requests
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- User roles table (for admin purposes)
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  UNIQUE (user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

CREATE POLICY "Users can view own roles" ON public.user_roles FOR SELECT TO authenticated
  USING (user_id = auth.uid());
