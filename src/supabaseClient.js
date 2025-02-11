// src/supabaseClient.js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://tsdqcubdaswmhiwskufu.supabase.co' ;
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRzZHFjdWJkYXN3bWhpd3NrdWZ1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzkyNDg2NzIsImV4cCI6MjA1NDgyNDY3Mn0.O1MDsy3B82m15qP-xnoNI2Rtw_VmhKnxXbE7hsvMW-Q' ;

const supabase = createClient(supabaseUrl, supabaseKey);

// Change this to named export
export { supabase };  // Named export
