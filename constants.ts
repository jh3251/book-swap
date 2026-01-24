
import { Division, District, Upazila } from './types';

export const DIVISIONS: Division[] = [
  { id: 'dhaka', name: 'Dhaka', nameBn: 'ঢাকা' },
  { id: 'chattogram', name: 'Chattogram', nameBn: 'চট্টগ্রাম' },
  { id: 'rajshahi', name: 'Rajshahi', nameBn: 'রাজশাহী' },
  { id: 'khulna', name: 'Khulna', nameBn: 'খুলনা' },
  { id: 'barishal', name: 'Barishal', nameBn: 'বরিশাল' },
  { id: 'sylhet', name: 'Sylhet', nameBn: 'সিলেট' },
  { id: 'rangpur', name: 'Rangpur', nameBn: 'রংপুর' },
  { id: 'mymensingh', name: 'Mymensingh', nameBn: 'ময়মনসিংহ' },
];

export const DISTRICTS: District[] = [
  // Dhaka Division
  { id: 'dhaka-dist', divisionId: 'dhaka', name: 'Dhaka', nameBn: 'ঢাকা' },
  { id: 'gazipur', divisionId: 'dhaka', name: 'Gazipur', nameBn: 'গাজীপুর' },
  { id: 'narayanganj', divisionId: 'dhaka', name: 'Narayanganj', nameBn: 'নারায়ণগঞ্জ' },
  { id: 'narsingdi', divisionId: 'dhaka', name: 'Narsingdi', nameBn: 'নরসিংদী' },
  { id: 'munshiganj', divisionId: 'dhaka', name: 'Munshiganj', nameBn: 'মুন্সীগঞ্জ' },
  { id: 'manikganj', divisionId: 'dhaka', name: 'Manikganj', nameBn: 'মানিকগঞ্জ' },
  { id: 'faridpur', divisionId: 'dhaka', name: 'Faridpur', nameBn: 'ফরিদপুর' },
  { id: 'rajbari', divisionId: 'dhaka', name: 'Rajbari', nameBn: 'রাজবাড়ী' },
  { id: 'gopalganj', divisionId: 'dhaka', name: 'Gopalganj', nameBn: 'গোপালগঞ্জ' },
  { id: 'madaripur', divisionId: 'dhaka', name: 'Madaripur', nameBn: 'মাদারীপুর' },
  { id: 'shariatpur', divisionId: 'dhaka', name: 'Shariatpur', nameBn: 'শরীয়তপুর' },

  // Mymensingh Division
  { id: 'mymensingh-dist', divisionId: 'mymensingh', name: 'Mymensingh', nameBn: 'ময়মনসিংহ' },
  { id: 'tangail', divisionId: 'mymensingh', name: 'Tangail', nameBn: 'টাঙ্গাইল' },
  { id: 'kishoreganj', divisionId: 'mymensingh', name: 'Kishoreganj', nameBn: 'কিশোরগঞ্জ' },
  { id: 'netrokona', divisionId: 'mymensingh', name: 'Netrokona', nameBn: 'নেত্রকোনা' },
  { id: 'jamalpur', divisionId: 'mymensingh', name: 'Jamalpur', nameBn: 'জামালপুর' },
  { id: 'sherpur', divisionId: 'mymensingh', name: 'Sherpur', nameBn: 'শেরপুর' },

  // Chattogram Division
  { id: 'chattogram-dist', divisionId: 'chattogram', name: 'Chattogram', nameBn: 'চট্টগ্রাম' },
  { id: 'coxsbazar', divisionId: 'chattogram', name: "Cox's Bazar", nameBn: 'কক্সবাজার' },
  { id: 'cumilla', divisionId: 'chattogram', name: 'Cumilla', nameBn: 'কুমিল্লা' },
  { id: 'feni', divisionId: 'chattogram', name: 'Feni', nameBn: 'ফেনী' },
  { id: 'brahmanbaria', divisionId: 'chattogram', name: 'Brahmanbaria', nameBn: 'ব্রাহ্মণবাড়িয়া' },
  { id: 'chandpur', divisionId: 'chattogram', name: 'Chandpur', nameBn: 'চাঁদপুর' },
  { id: 'lakshmipur', divisionId: 'chattogram', name: 'Lakshmipur', nameBn: 'লক্ষ্মীপুর' },
  { id: 'noakhali', divisionId: 'chattogram', name: 'Noakhali', nameBn: 'নোয়াখালী' },
  { id: 'rangamati', divisionId: 'chattogram', name: 'Rangamati', nameBn: 'রাঙ্গামাটি' },
  { id: 'khagrachhari', divisionId: 'chattogram', name: 'Khagrachhari', nameBn: 'খাগড়াছড়ি' },
  { id: 'bandarban', divisionId: 'chattogram', name: 'Bandarban', nameBn: 'বান্দরবান' },

  // Rajshahi Division
  { id: 'rajshahi-dist', divisionId: 'rajshahi', name: 'Rajshahi', nameBn: 'রাজশাহী' },
  { id: 'bogura', divisionId: 'rajshahi', name: 'Bogura', nameBn: 'বগুড়া' },
  { id: 'pabna', divisionId: 'rajshahi', name: 'Pabna', nameBn: 'পাবনা' },
  { id: 'sirajganj', divisionId: 'rajshahi', name: 'Sirajganj', nameBn: 'সিরাজগঞ্জ' },
  { id: 'naogaon', divisionId: 'rajshahi', name: 'Naogaon', nameBn: 'নওগাঁ' },
  { id: 'natore', divisionId: 'rajshahi', name: 'Natore', nameBn: 'নাটোর' },
  { id: 'joypurhat', divisionId: 'rajshahi', name: 'Joypurhat', nameBn: 'জয়পুরহাট' },
  { id: 'chapainawabganj', divisionId: 'rajshahi', name: 'Chapainawabganj', nameBn: 'চাঁপাইনবাবগঞ্জ' },

  // Khulna Division
  { id: 'khulna-dist', divisionId: 'khulna', name: 'Khulna', nameBn: 'খুলনা' },
  { id: 'jashore', divisionId: 'khulna', name: 'Jashore', nameBn: 'যশোর' },
  { id: 'satkhira', divisionId: 'khulna', name: 'Satkhira', nameBn: 'সাতক্ষীরা' },
  { id: 'bagerhat', divisionId: 'khulna', name: 'Bagerhat', nameBn: 'বাগেরহাট' },
  { id: 'chuadanga', divisionId: 'khulna', name: 'Chuadanga', nameBn: 'চুয়াডাঙ্গা' },
  { id: 'jhenaidah', divisionId: 'khulna', name: 'Jhenaidah', nameBn: 'ঝিনাইদহ' },
  { id: 'kushtia', divisionId: 'khulna', name: 'Kushtia', nameBn: 'কুষ্টিয়া' },
  { id: 'magura', divisionId: 'khulna', name: 'Magura', nameBn: 'মাগুরা' },
  { id: 'meherpur', divisionId: 'khulna', name: 'Meherpur', nameBn: 'মেহেরপুর' },
  { id: 'narail', divisionId: 'khulna', name: 'Narail', nameBn: 'নড়াইল' },

  // Barishal Division
  { id: 'barishal-dist', divisionId: 'barishal', name: 'Barishal', nameBn: 'বরিশাল' },
  { id: 'bhola', divisionId: 'barishal', name: 'Bhola', nameBn: 'ভোলা' },
  { id: 'jhalokati', divisionId: 'barishal', name: 'Jhalokati', nameBn: 'ঝালকাঠি' },
  { id: 'patuakhali', divisionId: 'barishal', name: 'Patuakhali', nameBn: 'পটুয়াখালী' },
  { id: 'pirojpur', divisionId: 'barishal', name: 'Pirojpur', nameBn: 'পিরোজপুর' },
  { id: 'barguna', divisionId: 'barishal', name: 'Barguna', nameBn: 'বরগুনা' },

  // Sylhet Division
  { id: 'sylhet-dist', divisionId: 'sylhet', name: 'Sylhet', nameBn: 'সিলেট' },
  { id: 'moulvibazar', divisionId: 'sylhet', name: 'Moulvibazar', nameBn: 'মৌলভীবাজার' },
  { id: 'habiganj', divisionId: 'sylhet', name: 'Habiganj', nameBn: 'হবিগঞ্জ' },
  { id: 'sunamganj', divisionId: 'sylhet', name: 'Sunamganj', nameBn: 'সুনামগঞ্জ' },

  // Rangpur Division
  { id: 'rangpur-dist', divisionId: 'rangpur', name: 'Rangpur', nameBn: 'রংপুর' },
  { id: 'dinajpur', divisionId: 'rangpur', name: 'Dinajpur', nameBn: 'দিনাজপুর' },
  { id: 'kurigram', divisionId: 'rangpur', name: 'Kurigram', nameBn: 'কুড়িগ্রাম' },
  { id: 'gaibandha', divisionId: 'rangpur', name: 'Gaibandha', nameBn: 'গাইবান্ধা' },
  { id: 'nilphamari', divisionId: 'rangpur', name: 'Nilphamari', nameBn: 'নীলফামারী' },
  { id: 'panchagarh', divisionId: 'rangpur', name: 'Panchagarh', nameBn: 'পঞ্চগড়' },
  { id: 'thakurgaon', divisionId: 'rangpur', name: 'Thakurgaon', nameBn: 'ঠাকুরগাঁও' },
  { id: 'lalmonirhat', divisionId: 'rangpur', name: 'Lalmonirhat', nameBn: 'লালমনিরহাট' },
];

export const UPAZILAS: Upazila[] = [
  // --- DHAKA DIVISION ---
  // Dhaka District
  { id: 'dhaka-kotwali', districtId: 'dhaka-dist', name: 'Kotwali Thana', nameBn: 'কোতোয়ালী থানা' },
  { id: 'dhaka-mohammadpur', districtId: 'dhaka-dist', name: 'Mohammadpur Thana', nameBn: 'মোহাম্মদপুর থানা' },
  { id: 'dhaka-lalbagh', districtId: 'dhaka-dist', name: 'Lalbagh Thana', nameBn: 'লালবাগ থানা' },
  { id: 'dhaka-sutrapur', districtId: 'dhaka-dist', name: 'Sutrapur Thana', nameBn: 'সূত্রাপুর থানা' },
  { id: 'dhaka-motijheel', districtId: 'dhaka-dist', name: 'Motijheel Thana', nameBn: 'মতিঝিল থানা' },
  { id: 'dhaka-demra', districtId: 'dhaka-dist', name: 'Demra Thana', nameBn: 'ডেমরা থানা' },
  { id: 'dhaka-sabujbagh', districtId: 'dhaka-dist', name: 'Sabujbagh Thana', nameBn: 'সবুজবাগ থানা' },
  { id: 'dhaka-mirpur', districtId: 'dhaka-dist', name: 'Mirpur Thana', nameBn: 'মিরপুর থানা' },
  { id: 'dhaka-gulshan', districtId: 'dhaka-dist', name: 'Gulshan Thana', nameBn: 'গুলশান থানা' },
  { id: 'dhaka-uttara', districtId: 'dhaka-dist', name: 'Uttara Thana', nameBn: 'উত্তরা থানা' },
  { id: 'dhaka-pallabi', districtId: 'dhaka-dist', name: 'Pallabi Thana', nameBn: 'পল্লবী থানা' },
  { id: 'dhaka-cantonment', districtId: 'dhaka-dist', name: 'Cantonment Thana', nameBn: 'ক্যান্টনমেন্ট থানা' },
  { id: 'dhaka-dhanmondi', districtId: 'dhaka-dist', name: 'Dhanmondi Thana', nameBn: 'ধানমন্ডি থানা' },
  { id: 'dhaka-tejgaon', districtId: 'dhaka-dist', name: 'Tejgaon Thana', nameBn: 'তেজগাঁও থানা' },
  { id: 'dhaka-ramna', districtId: 'dhaka-dist', name: 'Ramna Thana', nameBn: 'রমনা থানা' },
  { id: 'dhaka-keranigonj', districtId: 'dhaka-dist', name: 'Keranigonj', nameBn: 'কেরানীগঞ্জ' },
  { id: 'dhaka-dohar', districtId: 'dhaka-dist', name: 'Dohar', nameBn: 'দোহার' },
  { id: 'dhaka-nawabgonj', districtId: 'dhaka-dist', name: 'Nawabgonj', nameBn: 'নবাবগঞ্জ' },
  { id: 'dhaka-savar', districtId: 'dhaka-dist', name: 'Savar', nameBn: 'সাভার' },
  { id: 'dhaka-dhamrai', districtId: 'dhaka-dist', name: 'Dhamrai', nameBn: 'ধামরাই' },

  // Gazipur
  { id: 'gazipur-sadar', districtId: 'gazipur', name: 'Sadar Upozila', nameBn: 'সদর উপজেলা' },
  { id: 'gazipur-tongi', districtId: 'gazipur', name: 'Tongi Thana', nameBn: 'টঙ্গী থানা' },
  { id: 'gazipur-kaligonj', districtId: 'gazipur', name: 'Kaligonj', nameBn: 'কালীগঞ্জ' },
  { id: 'gazipur-kaliakoir', districtId: 'gazipur', name: 'Kaliakoir', nameBn: 'কালিয়াকৈর' },
  { id: 'gazipur-kapashia', districtId: 'gazipur', name: 'Kapashia', nameBn: 'কাপাসিয়া' },
  { id: 'gazipur-sreepur', districtId: 'gazipur', name: 'Sreepur', nameBn: 'শ্রীপুর' },

  // Narayanganj
  { id: 'narayanganj-sadar', districtId: 'narayanganj', name: 'Narayanganj Sadar', nameBn: 'নারায়ণগঞ্জ সদর' },
  { id: 'narayanganj-bandor', districtId: 'narayanganj', name: 'Bandor', nameBn: 'বন্দর' },
  { id: 'narayanganj-sonargaon', districtId: 'narayanganj', name: 'Sonargaon', nameBn: 'সোনারগাঁও' },
  { id: 'narayanganj-araihazar', districtId: 'narayanganj', name: 'Araihazar', nameBn: 'আড়াইহাজার' },
  { id: 'narayanganj-rupganj', districtId: 'narayanganj', name: 'Rupganj', nameBn: 'রূপগঞ্জ' },
  
  // Narsingdi
  { id: 'narsingdi-sadar', districtId: 'narsingdi', name: 'Narsingdi Sadar', nameBn: 'নরসিংদী সদর' },
  { id: 'narsingdi-belabo', districtId: 'narsingdi', name: 'Belabo', nameBn: 'বেলাবো' },
  { id: 'narsingdi-monohardi', districtId: 'narsingdi', name: 'Monohardi', nameBn: 'মনোহরদী' },
  { id: 'narsingdi-palash', districtId: 'narsingdi', name: 'Palash', nameBn: 'পলাশ' },
  { id: 'narsingdi-raipura', districtId: 'narsingdi', name: 'Raipura', nameBn: 'রায়পুরা' },
  { id: 'narsingdi-shibpur', districtId: 'narsingdi', name: 'Shibpur', nameBn: 'শিবপুর' },

  // Munshiganj
  { id: 'munshiganj-sadar', districtId: 'munshiganj', name: 'Munshiganj Sadar', nameBn: 'মুন্সীগঞ্জ সদর' },
  { id: 'munshiganj-sreenagar', districtId: 'munshiganj', name: 'Sreenagar', nameBn: 'শ্রীনগর' },
  { id: 'munshiganj-sirajdikhan', districtId: 'munshiganj', name: 'Sirajdikhan', nameBn: 'সিরাজদিখান' },
  { id: 'munshiganj-louhajong', districtId: 'munshiganj', name: 'Louhajong', nameBn: 'লৌহজং' },
  { id: 'munshiganj-tongibari', districtId: 'munshiganj', name: 'Tongibari', nameBn: 'টঙ্গিবাড়ী' },
  { id: 'munshiganj-gazaria', districtId: 'munshiganj', name: 'Gazaria', nameBn: 'গজারিয়া' },

  // --- CHATTOGRAM DIVISION ---
  // Chattogram District
  { id: 'ctg-panchlaish', districtId: 'chattogram-dist', name: 'Panchlaish Thana', nameBn: 'পাঁচলাইশ থানা' },
  { id: 'ctg-chandgaon', districtId: 'chattogram-dist', name: 'Chandgaon Thana', nameBn: 'চান্দগাঁও থানা' },
  { id: 'ctg-kotwali', districtId: 'chattogram-dist', name: 'Kotwali Thana', nameBn: 'কোতোয়ালী থানা' },
  { id: 'ctg-bakalia', districtId: 'chattogram-dist', name: 'Bakalia Thana', nameBn: 'বাকলিয়া থানা' },
  { id: 'ctg-patenga', districtId: 'chattogram-dist', name: 'Patenga Thana', nameBn: 'পতেঙ্গা থানা' },
  { id: 'ctg-halishahar', districtId: 'chattogram-dist', name: 'Halishahar Thana', nameBn: 'হালিশহর থানা' },
  { id: 'ctg-mirsharai', districtId: 'chattogram-dist', name: 'Mirsharai', nameBn: 'মীরসরাই' },
  { id: 'ctg-sitakunda', districtId: 'chattogram-dist', name: 'Sitakunda', nameBn: 'সীতাকুণ্ড' },
  { id: 'ctg-fatikchhari', districtId: 'chattogram-dist', name: 'Fatikchhari', nameBn: 'ফটিকছড়ি' },
  { id: 'ctg-hathazari', districtId: 'chattogram-dist', name: 'Hathazari', nameBn: 'হাটহাজারী' },
  { id: 'ctg-raoza', districtId: 'chattogram-dist', name: 'Raoza', nameBn: 'রাউজান' },
  { id: 'ctg-rangunia', districtId: 'chattogram-dist', name: 'Rangunia', nameBn: 'রাঙ্গুনিয়া' },
  { id: 'ctg-boalkhali', districtId: 'chattogram-dist', name: 'Boalkhali', nameBn: 'বোয়ালখালী' },
  { id: 'ctg-anwara', districtId: 'chattogram-dist', name: 'Anwara', nameBn: 'আনোয়ারা' },
  { id: 'ctg-patiya', districtId: 'chattogram-dist', name: 'Patiya', nameBn: 'পটিয়া' },
  { id: 'ctg-banskhali', districtId: 'chattogram-dist', name: 'Banskhali', nameBn: 'বাঁশখালী' },
  { id: 'ctg-chandanaish', districtId: 'chattogram-dist', name: 'Chandanaish', nameBn: 'চন্দনাইশ' },
  { id: 'ctg-lohagara', districtId: 'chattogram-dist', name: 'Lohagara', nameBn: 'লোহাগাড়া' },
  { id: 'ctg-satkania', districtId: 'chattogram-dist', name: 'Satkania', nameBn: 'সাতকানিয়া' },
  { id: 'ctg-sandwip', districtId: 'chattogram-dist', name: 'Sandwip', nameBn: 'সন্দ্বীপ' },

  // Cox's Bazar
  { id: 'cox-sadar', districtId: 'coxsbazar', name: 'Cox\'s Bazar Sadar', nameBn: 'কক্সবাজার সদর' },
  { id: 'cox-chakaria', districtId: 'coxsbazar', name: 'Chakaria', nameBn: 'চকরিয়া' },
  { id: 'cox-teknaf', districtId: 'coxsbazar', name: 'Teknaf', nameBn: 'টেকনাফ' },
  { id: 'cox-ukhiya', districtId: 'coxsbazar', name: 'Ukhiya', nameBn: 'উখিয়া' },
  { id: 'cox-ramu', districtId: 'coxsbazar', name: 'Ramu', nameBn: 'রামু' },
  { id: 'cox-pekarua', districtId: 'coxsbazar', name: 'Pekua', nameBn: 'পেকুয়া' },
  { id: 'cox-kutubdia', districtId: 'coxsbazar', name: 'Kutubdia', nameBn: 'কুতুবদিয়া' },
  { id: 'cox-maheshkhali', districtId: 'coxsbazar', name: 'Maheshkhali', nameBn: 'মহেশখালী' },

  // Cumilla
  { id: 'cumilla-sadar', districtId: 'cumilla', name: 'Cumilla Sadar', nameBn: 'কুমিল্লা সদর' },
  { id: 'cumilla-laksham', districtId: 'cumilla', name: 'Laksham', nameBn: 'লাকসাম' },
  { id: 'cumilla-debidwar', districtId: 'cumilla', name: 'Debidwar', nameBn: 'দেবিদ্বার' },
  { id: 'cumilla-burichang', districtId: 'cumilla', name: 'Burichang', nameBn: 'বুড়িচং' },
  { id: 'cumilla-brahmanpara', districtId: 'cumilla', name: 'Brahmanpara', nameBn: 'ব্রাহ্মণপাড়া' },
  { id: 'cumilla-chauddagram', districtId: 'cumilla', name: 'Chauddagram', nameBn: 'চৌদ্দগ্রাম' },
  { id: 'cumilla-barura', districtId: 'cumilla', name: 'Barura', nameBn: 'বরুড়া' },
  { id: 'cumilla-nangalkot', districtId: 'cumilla', name: 'Nangalkot', nameBn: 'নাঙ্গলকোট' },
  { id: 'cumilla-chandina', districtId: 'cumilla', name: 'Chandina', nameBn: 'চান্দিনা' },
  { id: 'cumilla-homna', districtId: 'cumilla', name: 'Homna', nameBn: 'হোমনা' },
  { id: 'cumilla-daudkandi', districtId: 'cumilla', name: 'Daudkandi', nameBn: 'দাউদকান্দি' },
  { id: 'cumilla-muradnagar', districtId: 'cumilla', name: 'Muradnagar', nameBn: 'মুরাদনগর' },

  // --- RAJSHAHI DIVISION ---
  // Rajshahi District
  { id: 'raj-boalia', districtId: 'rajshahi-dist', name: 'Boalia Thana', nameBn: 'বোয়ালিয়া থানা' },
  { id: 'raj-matihar', districtId: 'rajshahi-dist', name: 'Matihar Thana', nameBn: 'মতিহার থানা' },
  { id: 'raj-rajpara', districtId: 'rajshahi-dist', name: 'Rajpara Thana', nameBn: 'রাজপাড়া থানা' },
  { id: 'raj-paba', districtId: 'rajshahi-dist', name: 'Paba', nameBn: 'পবা' },
  { id: 'raj-godagari', districtId: 'rajshahi-dist', name: 'Godagari', nameBn: 'গোদাগাড়ী' },
  { id: 'raj-tanore', districtId: 'rajshahi-dist', name: 'Tanore', nameBn: 'তানোর' },
  { id: 'raj-mohanpur', districtId: 'rajshahi-dist', name: 'Mohanpur', nameBn: 'মোহনপুর' },
  { id: 'raj-bagmara', districtId: 'rajshahi-dist', name: 'Bagmara', nameBn: 'বাগমারা' },
  { id: 'raj-durgapur', districtId: 'rajshahi-dist', name: 'Durgapur', nameBn: 'দুর্গাপুর' },
  { id: 'raj-puthia', districtId: 'rajshahi-dist', name: 'Puthia', nameBn: 'পুঠিয়া' },
  { id: 'raj-charghat', districtId: 'rajshahi-dist', name: 'Charghat', nameBn: 'চারঘাট' },
  { id: 'raj-bagha', districtId: 'rajshahi-dist', name: 'Bagha', nameBn: 'বাঘা' },

  // Bogura
  { id: 'bogura-sadar', districtId: 'bogura', name: 'Bogura Sadar', nameBn: 'বগুড়া সদর' },
  { id: 'bogura-shajahanpur', districtId: 'bogura', name: 'Shajahanpur', nameBn: 'শাজাহানপুর' },
  { id: 'bogura-sherpur', districtId: 'bogura', name: 'Sherpur', nameBn: 'শেরপুর' },
  { id: 'bogura-dhunat', districtId: 'bogura', name: 'Dhunat', nameBn: 'ধুনট' },
  { id: 'bogura-gabtali', districtId: 'bogura', name: 'Gabtali', nameBn: 'গাবতলী' },
  { id: 'bogura-shariakandi', districtId: 'bogura', name: 'Shariakandi', nameBn: 'সারিয়াকান্দি' },
  { id: 'bogura-sonatola', districtId: 'bogura', name: 'Sonatola', nameBn: 'সোনাতলা' },
  { id: 'bogura-shibganj', districtId: 'bogura', name: 'Shibganj', nameBn: 'শিবগঞ্জ' },
  { id: 'bogura-kahaloo', districtId: 'bogura', name: 'Kahaloo', nameBn: 'কাহালু' },
  { id: 'bogura-nandigram', districtId: 'bogura', name: 'Nandigram', nameBn: 'নন্দীগ্রাম' },
  { id: 'bogura-dupchanchia', districtId: 'bogura', name: 'Dupchanchia', nameBn: 'দুপচাঁচিয়া' },
  { id: 'bogura-adamdighi', districtId: 'bogura', name: 'Adamdighi', nameBn: 'আদমদীঘি' },

  // --- SYLHET DIVISION ---
  // Sylhet District
  { id: 'syl-kotwali', districtId: 'sylhet-dist', name: 'Kotwali Thana', nameBn: 'কোতোয়ালী থানা' },
  { id: 'syl-southsurma', districtId: 'sylhet-dist', name: 'South Surma', nameBn: 'দক্ষিণ সুরমা' },
  { id: 'syl-biswanath', districtId: 'sylhet-dist', name: 'Biswanath', nameBn: 'বিশ্বনাথ' },
  { id: 'syl-fenchuganj', districtId: 'sylhet-dist', name: 'Fenchuganj', nameBn: 'ফেঞ্চুগঞ্জ' },
  { id: 'syl-balaganj', districtId: 'sylhet-dist', name: 'Balaganj', nameBn: 'বালাগঞ্জ' },
  { id: 'syl-golapganj', districtId: 'sylhet-dist', name: 'Golapganj', nameBn: 'গোলাপগঞ্জ' },
  { id: 'syl-beanibazar', districtId: 'sylhet-dist', name: 'Beanibazar', nameBn: 'বিয়ানীবাজার' },
  { id: 'syl-zakiganj', districtId: 'sylhet-dist', name: 'Zakiganj', nameBn: 'জকিগঞ্জ' },
  { id: 'syl-kanaighat', districtId: 'sylhet-dist', name: 'Kanaighat', nameBn: 'কানাইঘাট' },
  { id: 'syl-jaintiapur', districtId: 'sylhet-dist', name: 'Jaintiapur', nameBn: 'জৈন্তাপুর' },
  { id: 'syl-goainghat', districtId: 'sylhet-dist', name: 'Goainghat', nameBn: 'গোয়াইনঘাট' },
  { id: 'syl-companiganj', districtId: 'sylhet-dist', name: 'Companiganj', nameBn: 'কোম্পানীগঞ্জ' },

  // Moulvibazar
  { id: 'mou-sadar', districtId: 'moulvibazar', name: 'Moulvibazar Sadar', nameBn: 'মৌলভীবাজার সদর' },
  { id: 'mou-sreemangal', districtId: 'moulvibazar', name: 'Sreemangal', nameBn: 'শ্রীমঙ্গল' },
  { id: 'mou-kamalganj', districtId: 'moulvibazar', name: 'Kamalganj', nameBn: 'কমলগঞ্জ' },
  { id: 'mou-rajnagar', districtId: 'moulvibazar', name: 'Rajnagar', nameBn: 'রাজনগর' },
  { id: 'mou-kulaura', districtId: 'moulvibazar', name: 'Kulaura', nameBn: 'কুলাউড়া' },
  { id: 'mou-juri', districtId: 'moulvibazar', name: 'Juri', nameBn: 'জুড়ী' },
  { id: 'mou-barlekha', districtId: 'moulvibazar', name: 'Barlekha', nameBn: 'বড়লেখা' },

  // --- KHULNA DIVISION ---
  // Khulna District
  { id: 'khu-kotwali', districtId: 'khulna-dist', name: 'Kotwali Thana', nameBn: 'কোতোয়ালী থানা' },
  { id: 'khu-daulatpur', districtId: 'khulna-dist', name: 'Daulatpur Thana', nameBn: 'দৌলতপুর থানা' },
  { id: 'khu-khalishpur', districtId: 'khulna-dist', name: 'Khalishpur Thana', nameBn: 'খালিশপুর থানা' },
  { id: 'khu-sonadanga', districtId: 'khulna-dist', name: 'Sonadanga Thana', nameBn: 'সোনাডাঙ্গা থানা' },
  { id: 'khu-khanjahan', districtId: 'khulna-dist', name: 'Khan Jahan Ali Thana', nameBn: 'খান জাহান আলী থানা' },
  { id: 'khu-phultala', districtId: 'khulna-dist', name: 'Phultala', nameBn: 'ফুলতলা' },
  { id: 'khu-dighalia', districtId: 'khulna-dist', name: 'Dighalia', nameBn: 'দিঘলিয়া' },
  { id: 'khu-terokhada', districtId: 'khulna-dist', name: 'Terokhada', nameBn: 'তেরখাদা' },
  { id: 'khu-dumuria', districtId: 'khulna-dist', name: 'Dumuria', nameBn: 'ডুমুরিয়া' },
  { id: 'khu-rupsha', districtId: 'khulna-dist', name: 'Rupsha', nameBn: 'রূপসা' },
  { id: 'khu-batighata', districtId: 'khulna-dist', name: 'Batiaghata', nameBn: 'বটিয়াঘাটা' },
  { id: 'khu-dacope', districtId: 'khulna-dist', name: 'Dacope', nameBn: 'দাকোপ' },
  { id: 'khu-paikgachha', districtId: 'khulna-dist', name: 'Paikgachha', nameBn: 'পাইকগাছা' },
  { id: 'khu-koyra', districtId: 'khulna-dist', name: 'Koyra', nameBn: 'কয়রা' },

  // Jashore
  { id: 'jas-sadar', districtId: 'jashore', name: 'Jashore Sadar', nameBn: 'যশোর সদর' },
  { id: 'jas-jhikargachha', districtId: 'jashore', name: 'Jhikargachha', nameBn: 'ঝিকরগাছা' },
  { id: 'jas-sharsha', districtId: 'jashore', name: 'Sharsha', nameBn: 'শার্শা' },
  { id: 'jas-benapole', districtId: 'jashore', name: 'Benapole Thana', nameBn: 'বেনাপোল থানা' },
  { id: 'jas-manirampur', districtId: 'jashore', name: 'Manirampur', nameBn: 'মণিরামপুর' },
  { id: 'jas-keshabpur', districtId: 'jashore', name: 'Keshabpur', nameBn: 'কেশবপুর' },
  { id: 'jas-abhaynagar', districtId: 'jashore', name: 'Abhaynagar', nameBn: 'অভয়নগর' },
  { id: 'jas-bagherpara', districtId: 'jashore', name: 'Bagherpara', nameBn: 'বাঘেরপাড়া' },
  { id: 'jas-chaugachha', districtId: 'jashore', name: 'Chaugachha', nameBn: 'চৌগাছা' },

  // --- BARISHAL DIVISION ---
  // Barishal District
  { id: 'bar-kotwali', districtId: 'barishal-dist', name: 'Kotwali Thana', nameBn: 'কোতোয়ালী থানা' },
  { id: 'bar-airport', districtId: 'barishal-dist', name: 'Airport Thana', nameBn: 'এয়ারপোর্ট থানা' },
  { id: 'bar-kawnia', districtId: 'barishal-dist', name: 'Kawnia Thana', nameBn: 'কাউনিয়া থানা' },
  { id: 'bar-sadar', districtId: 'barishal-dist', name: 'Barishal Sadar', nameBn: 'বরিশাল সদর' },
  { id: 'bar-bakerganj', districtId: 'barishal-dist', name: 'Bakerganj', nameBn: 'বাকেরগঞ্জ' },
  { id: 'bar-babuganj', districtId: 'barishal-dist', name: 'Babuganj', nameBn: 'বাবুগঞ্জ' },
  { id: 'bar-muladi', districtId: 'barishal-dist', name: 'Muladi', nameBn: 'মুলাদী' },
  { id: 'bar-mehendiganj', districtId: 'barishal-dist', name: 'Mehendiganj', nameBn: 'মেহেন্দিগঞ্জ' },
  { id: 'bar-hizla', districtId: 'barishal-dist', name: 'Hizla', nameBn: 'হিজলা' },
  { id: 'bar-banaripara', districtId: 'barishal-dist', name: 'Banaripara', nameBn: 'বানারীপাড়া' },
  { id: 'bar-wazirpur', districtId: 'barishal-dist', name: 'Wazirpur', nameBn: 'উজিরপুর' },
  { id: 'bar-gaurnadi', districtId: 'barishal-dist', name: 'Gaurnadi', nameBn: 'গৌরনদী' },
  { id: 'bar-agailjhara', districtId: 'barishal-dist', name: 'Agailjhara', nameBn: 'আগৈলঝারা' },

  // --- RANGPUR DIVISION ---
  // Rangpur District
  { id: 'ran-kotwali', districtId: 'rangpur-dist', name: 'Kotwali Thana', nameBn: 'কোতোয়ালী থানা' },
  { id: 'ran-sadar', districtId: 'rangpur-dist', name: 'Rangpur Sadar', nameBn: 'রংপুর সদর' },
  { id: 'ran-pirganj', districtId: 'rangpur-dist', name: 'Pirganj', nameBn: 'পীরগঞ্জ' },
  { id: 'ran-pirgachha', districtId: 'rangpur-dist', name: 'Pirgachha', nameBn: 'পীরগাছা' },
  { id: 'ran-kaunia', districtId: 'rangpur-dist', name: 'Kaunia', nameBn: 'কাউনিয়া' },
  { id: 'ran-badarganj', districtId: 'rangpur-dist', name: 'Badarganj', nameBn: 'বদরগঞ্জ' },
  { id: 'ran-taraganj', districtId: 'rangpur-dist', name: 'তারাগঞ্জ', nameBn: 'তারাগঞ্জ' },
  { id: 'ran-mithapukur', districtId: 'rangpur-dist', name: 'Mithapukur', nameBn: 'মিঠাপুকুর' },
  { id: 'ran-gangachara', districtId: 'rangpur-dist', name: 'Gangachara', nameBn: 'গঙ্গাচড়া' },

  // --- MYMENSINGH DIVISION ---
  // Mymensingh District
  { id: 'mym-sadar', districtId: 'mymensingh-dist', name: 'Mymensingh Sadar', nameBn: 'ময়মনসিংহ সদর' },
  { id: 'mym-muktagachha', districtId: 'mymensingh-dist', name: 'Muktagachha', nameBn: 'মুক্তাগাছা' },
  { id: 'mym-phulpur', districtId: 'mymensingh-dist', name: 'Phulpur', nameBn: 'ফুলপুর' },
  { id: 'mym-gauripur', districtId: 'mymensingh-dist', name: 'Gauripur', nameBn: 'গৌরীপুর' },
  { id: 'mym-ishwarganj', districtId: 'mymensingh-dist', name: 'Ishwarganj', nameBn: 'ঈশ্বরগঞ্জ' },
  { id: 'mym-nandail', districtId: 'mymensingh-dist', name: 'Nandail', nameBn: 'নান্দাইল' },
  { id: 'mym-trishal', districtId: 'mymensingh-dist', name: 'Trishal', nameBn: 'ত্রিশাল' },
  { id: 'mym-bhaluka', districtId: 'mymensingh-dist', name: 'Bhaluka', nameBn: 'ভালুকা' },
  { id: 'mym-gafargaon', districtId: 'mymensingh-dist', name: 'Gafargaon', nameBn: 'গফরগাঁও' },
  { id: 'mym-haluaghat', districtId: 'mymensingh-dist', name: 'Haluaghat', nameBn: 'হালুয়াঘাট' },
  { id: 'mym-dhobaura', districtId: 'mymensingh-dist', name: 'Dhobaura', nameBn: 'ধোবাউড়া' },
  { id: 'mym-fulbaria', districtId: 'mymensingh-dist', name: 'Fulbaria', nameBn: 'ফুলবাড়ীয়া' },

  // Netrokona
  { id: 'net-sadar', districtId: 'netrokona', name: 'Netrokona Sadar', nameBn: 'নেত্রকোনা সদর' },
  { id: 'net-barhatta', districtId: 'netrokona', name: 'Barhatta', nameBn: 'বারহাট্টা' },
  { id: 'net-durgapur', districtId: 'netrokona', name: 'Durgapur', nameBn: 'দুর্গাপুর' },
  { id: 'net-kendua', districtId: 'netrokona', name: 'Kendua', nameBn: 'কেন্দুয়া' },
  { id: 'net-atpara', districtId: 'netrokona', name: 'Atpara', nameBn: 'আটপাড়া' },
  { id: 'net-madan', districtId: 'netrokona', name: 'Madan', nameBn: 'মদন' },
  { id: 'net-khaliajuri', districtId: 'netrokona', name: 'Khaliajuri', nameBn: 'খালিয়াজুরী' },
  { id: 'net-kalmakanda', districtId: 'netrokona', name: 'Kalmakanda', nameBn: 'কলমাকান্দা' },
  { id: 'net-mohanganj', districtId: 'netrokona', name: 'Mohanganj', nameBn: 'মোহনগঞ্জ' },
  { id: 'net-purbadhala', districtId: 'netrokona', name: 'Purbadhala', nameBn: 'পূর্বধলা' },
];

export const CONDITIONS = ['Donation', 'Like New', 'Good', 'Fair', 'Poor'] as const;

export const CLASSES = [
  'Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5', 
  'Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10', 
  'Class 11', 'Class 12', 'Other'
] as const;
