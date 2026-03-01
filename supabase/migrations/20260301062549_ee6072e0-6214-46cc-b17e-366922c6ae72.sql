
-- Allow admins to view all orders
CREATE POLICY "Admins can view all orders"
ON public.orders
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Allow admins to view all course progress
CREATE POLICY "Admins can view all course progress"
ON public.course_progress
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));
