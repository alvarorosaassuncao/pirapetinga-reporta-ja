// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://mdpvxwxgytkrgprxotgn.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1kcHZ4d3hneXRrcmdwcnhvdGduIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY2MjQ3NDksImV4cCI6MjA2MjIwMDc0OX0.wUv7dQ4fmm4RprI2iVyzXYxFaWZcoloV4DzYwAcZ_lI";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);