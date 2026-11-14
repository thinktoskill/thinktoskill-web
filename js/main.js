// Main Application Script for ThinkToSkill Virtual Academy

// HTML entity escaping helper to prevent XSS
function escapeHTML(str) {
  if (typeof str !== 'string') return str == null ? '' : String(str);
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// Normalize a national number plus a selected calling code into E.164 form.
function normalizePhoneNumber(rawPhone, countryCode = '+91') {
  const input = String(rawPhone || '').trim();
  const digits = input.replace(/\D/g, '');
  if (!digits) return { valid: false, phone: '' };

  let fullDigits;
  if (input.startsWith('+')) {
    fullDigits = digits;
  } else if (countryCode && countryCode !== 'other') {
    fullDigits = `${String(countryCode).replace(/\D/g, '')}${digits}`;
  } else {
    return { valid: false, phone: '' };
  }

  return {
    valid: fullDigits.length >= 8 && fullDigits.length <= 15,
    phone: `+${fullDigits}`
  };
}

function normalizeStoredPhoneNumber(phone) {
  const input = String(phone || '').trim();
  return normalizePhoneNumber(input, input.startsWith('+') ? 'other' : '+91');
}
window.normalizePhoneNumber = normalizePhoneNumber;

const CANDIDATE_SESSION_KEY = 'tts_candidate_session';
const LEGACY_CANDIDATE_STORAGE_KEYS = [
  'tts_candidate_registry',
  'tts_candidate_registered',
  'tts_student_registered',
  'tts_registered_candidate',
  'tts_registered_student'
];

function clearLegacyCandidateStorage(preserveActiveProfile = false) {
  try {
    if (preserveActiveProfile && !sessionStorage.getItem(CANDIDATE_SESSION_KEY)) {
      const raw = localStorage.getItem('tts_registered_candidate') || localStorage.getItem('tts_registered_student');
      const legacyProfile = raw ? JSON.parse(raw) : null;
      const phone = normalizeStoredPhoneNumber(legacyProfile?.phone);
      if (legacyProfile && phone.valid) {
        sessionStorage.setItem(CANDIDATE_SESSION_KEY, JSON.stringify({
          name: String(legacyProfile.name || 'Registered Candidate'),
          phone: phone.phone
        }));
      }
    }
    LEGACY_CANDIDATE_STORAGE_KEYS.forEach(key => localStorage.removeItem(key));
  } catch (e) {
    // Storage may be unavailable in private browsing; registration can continue in memory.
  }
}
clearLegacyCandidateStorage(true);

// Deliver lead to admissions desk via secure HTTPS endpoint
async function deliverLeadToBackend(leadData) {
  try {
    const payload = {
      name: leadData.name,
      phone: leadData.phone,
      email: leadData.email || 'Not provided',
      course: leadData.courseTitle || leadData.courseName,
      schedule: leadData.batchSchedule || 'Weekday Evening',
      qualification: leadData.qualification || 'Graduate',
      city: leadData.city || 'Not specified',
      message: leadData.message || '',
      submittedAt: new Date().toISOString(),
      _subject: `New Lead: ${leadData.name} - ${leadData.courseTitle || leadData.courseName}`,
      _template: 'table'
    };

    // Auto-forward lead to ThinkToSkill CandidateCRM Webhook API (localhost:8080)
    try {
      fetch('http://localhost:8080/api/enquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: leadData.name,
          phone: leadData.phone,
          email: leadData.email || '',
          course: leadData.courseTitle || leadData.courseName,
          city: leadData.city || 'India',
          message: `Batch: ${leadData.batchSchedule || 'Weekday Evening'} | Qual: ${leadData.qualification || 'Graduate'}${leadData.message ? ' | Note: ' + leadData.message : ''}`,
          source: 'ThinkToSkill Website Form'
        })
      }).then(r => r.json()).then(res => {
        console.log('[CRM SYNC] Lead logged in ThinkToSkill CRM:', res);
      }).catch(() => {
        // CRM server may be offline, fails gracefully
      });
    } catch (crmErr) {
      // safe fallback
    }

    const response = await fetch('https://formsubmit.co/ajax/thinktoskill@gmail.com', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(payload)
    });
    const result = await response.json().catch(() => null);
    return response.ok && (result?.success === true || result?.success === 'true');
  } catch (err) {
    console.warn('FormSubmit delivery failed; no receipt was confirmed.', err);
    return false;
  }
}
window.deliverLeadToBackend = deliverLeadToBackend;

document.addEventListener('DOMContentLoaded', () => {
  initSkillsMatrix();
  initCoursesGrid();
  initCategoryFilters();
  initCourseSearch();
  initHeroSearchAutocomplete();
  initTrainingModes();
  initFreeAddonBenefits();
  initAdmissionForm();
  initFaqAccordion();
  initVirtualFeatures();
  initTestimonials();
  initMobileMenu();
  initActiveNavTabs();
  setupWhatsAppTriggers();
  initRegistrationPopup();
  updateCandidateAccessUI();
});

// 1. Render Course Cards
function renderCourseCards(coursesToRender = COURSES_DATA) {
  const container = document.getElementById('courses-grid');
  if (!container) return;

  if (coursesToRender.length === 0) {
    container.innerHTML = `
      <div class="col-span-full text-center py-12 bg-white rounded-2xl border border-dashed border-slate-300">
        <div class="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
        </div>
        <h4 class="text-xl font-bold text-slate-800">No courses match your search</h4>
        <p class="text-slate-500 mt-1">Try clearing your filters or search for another keyword like "Java", "Python", or "AWS".</p>
        <button onclick="resetCourseFilters()" class="mt-4 px-5 py-2.5 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition">View All Courses</button>
      </div>
    `;
    return;
  }

  container.innerHTML = coursesToRender.map(course => {
    const toolsBadges = course.tools.slice(0, 5).map(tool => 
      `<span class="px-2.5 py-1 text-xs font-medium bg-slate-100 text-slate-700 rounded-md">${tool}</span>`
    ).join('');

    return `
      <div class="course-card group bg-white rounded-2xl border border-slate-200/80 hover:border-blue-400 hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden relative">
        <div class="p-6 flex-1 flex flex-col">
          <!-- Top Badges -->
          <div class="flex items-center justify-between gap-2 mb-3">
            <span class="px-3 py-1 text-xs font-bold rounded-full uppercase tracking-wider ${
              course.badge.includes('Popular') ? 'bg-amber-100 text-amber-800' :
              course.badge.includes('Trending') ? 'bg-purple-100 text-purple-800' :
              course.badge.includes('High') ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'
            }">
              ★ ${course.badge}
            </span>
            <span class="text-xs font-semibold text-slate-500 flex items-center gap-1">
              <span class="w-2 h-2 rounded-full bg-emerald-500"></span>
              ${course.batchType.split('&')[0]}
            </span>
          </div>

          <!-- Course Title -->
          <h3 class="text-xl font-extrabold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-2 mb-2">
            ${course.title}
          </h3>

          <p class="text-sm text-slate-600 line-clamp-2 mb-4 leading-relaxed">
            ${course.shortDesc}
          </p>

          <!-- Key Metadata Pills -->
          <div class="grid grid-cols-2 gap-2 py-3 border-y border-slate-100 my-auto text-xs text-slate-600">
            <div class="flex items-center gap-2">
              <svg class="w-4 h-4 text-blue-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              <span>${course.duration}</span>
            </div>
            <div class="flex items-center gap-2">
              <svg class="w-4 h-4 text-blue-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>
              <span>${course.mode.split('(')[0]}</span>
            </div>
            <div class="flex items-center gap-2">
              <svg class="w-4 h-4 text-emerald-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              <span>Placement Assistant</span>
            </div>
            <div class="flex items-center gap-2">
              <svg class="w-4 h-4 text-amber-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
              <span class="font-bold text-slate-800">${course.rating}</span>
              <span class="text-slate-400">(${course.reviewsCount}+)</span>
            </div>
          </div>

          <!-- Tools tags -->
          <div class="mt-4 flex flex-wrap gap-1.5">
            ${toolsBadges}
            ${course.tools.length > 5 ? `<span class="px-2 py-0.5 text-xs text-slate-500 font-medium">+${course.tools.length - 5} more</span>` : ''}
          </div>

          <!-- Fee and CTC Section -->
          <div class="mt-5 pt-4 border-t border-slate-100 flex items-end justify-between">
            <div>
              <div class="flex items-center gap-1.5 mb-0.5">
                <span class="text-xs text-slate-500 font-medium">Course Fee</span>
                <span class="text-[9px] font-extrabold text-amber-800 bg-amber-100 px-1.5 py-0.5 rounded border border-amber-200 uppercase tracking-tight">+ 18% GST Applicable</span>
              </div>
              <div class="flex items-baseline gap-2">
                <span class="text-2xl font-extrabold text-slate-900">₹${course.discountedFee.toLocaleString('en-IN')}</span>
                <span class="text-xs text-slate-400 line-through">₹${course.originalFee.toLocaleString('en-IN')}</span>
              </div>
              <div class="text-[11px] text-emerald-600 font-semibold mt-0.5">
                ✓ Live Training + Cloud Lab Access
              </div>
            </div>
            <div class="text-right">
              <div class="text-[11px] text-slate-500 font-medium">Payment Option</div>
              <div class="text-xs font-extrabold text-blue-700 bg-blue-50 px-2.5 py-1.5 rounded-lg border border-blue-100">
                2 Easy Milestones
              </div>
            </div>
          </div>
        </div>

        <!-- Action Buttons (ACTE High-Converting Dual CTAs) -->
        <div class="p-4 bg-slate-50/90 border-t border-slate-100 flex flex-col gap-2">
          <div class="flex items-center gap-2">
            <button onclick="handleSyllabusButtonClick('${course.id}')" class="flex-1 py-2.5 px-3 bg-white hover:bg-slate-100 text-slate-800 font-extrabold text-xs rounded-xl border border-slate-300 transition text-center shadow-sm flex items-center justify-center gap-1.5">
              <svg class="w-3.5 h-3.5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
              <span>Download Syllabus</span>
            </button>
            <button onclick="goToAdmissions('${course.id}')" class="flex-1 py-2.5 px-3 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs rounded-xl transition text-center shadow-md shadow-blue-500/20 flex items-center justify-center gap-1">
              <span>Enroll / Apply Now</span>
            </button>
          </div>
          <button onclick="openCourseDetails('${course.id}')" class="w-full text-center text-[11px] font-bold text-blue-600 hover:text-blue-800 hover:underline pt-1">
            View Complete Week-by-Week Curriculum & Projects →
          </button>
        </div>
      </div>
    `;
  }).join('');
}

function initCoursesGrid() {
  renderCourseCards(COURSES_DATA);
}

// 2. Category Filters
function initCategoryFilters() {
  const filterBtns = document.querySelectorAll('.category-filter-btn');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => {
        b.classList.remove('bg-blue-600', 'text-white', 'shadow-md');
        b.classList.add('bg-white', 'text-slate-700', 'hover:bg-slate-100');
      });
      btn.classList.remove('bg-white', 'text-slate-700', 'hover:bg-slate-100');
      btn.classList.add('bg-blue-600', 'text-white', 'shadow-md');

      const category = btn.getAttribute('data-category');
      const searchVal = document.getElementById('course-search')?.value.toLowerCase().trim() || '';

      filterAndRender(category, searchVal);
    });
  });
}

function initCourseSearch() {
  const searchInput = document.getElementById('course-search');
  if (!searchInput) return;

  searchInput.addEventListener('input', (e) => {
    const searchVal = e.target.value.toLowerCase().trim();
    const activeCategoryBtn = document.querySelector('.category-filter-btn.bg-blue-600');
    const category = activeCategoryBtn ? activeCategoryBtn.getAttribute('data-category') : 'all';

    filterAndRender(category, searchVal);
  });
}

function filterAndRender(category, query) {
  let filtered = COURSES_DATA;

  if (category && category !== 'all') {
    filtered = filtered.filter(c => c.category === category);
  }

  if (query) {
    filtered = filtered.filter(c => {
      const matchTitle = c.title.toLowerCase().includes(query);
      const matchDesc = c.shortDesc.toLowerCase().includes(query);
      const matchTools = c.tools.some(t => t.toLowerCase().includes(query));
      const matchRoles = c.careerRoles.some(r => r.toLowerCase().includes(query));
      return matchTitle || matchDesc || matchTools || matchRoles;
    });
  }

  renderCourseCards(filtered);
}

function resetCourseFilters() {
  const searchInput = document.getElementById('course-search');
  if (searchInput) searchInput.value = '';

  const filterBtns = document.querySelectorAll('.category-filter-btn');
  filterBtns.forEach(b => {
    if (b.getAttribute('data-category') === 'all') {
      b.classList.remove('bg-white', 'text-slate-700');
      b.classList.add('bg-blue-600', 'text-white');
    } else {
      b.classList.remove('bg-blue-600', 'text-white');
      b.classList.add('bg-white', 'text-slate-700');
    }
  });

  renderCourseCards(COURSES_DATA);
}

// 2b. Skills Matrix (17 In-Demand Skills)
function initSkillsMatrix() {
  const container = document.getElementById('skills-matrix-grid');
  if (!container || typeof SKILLS_LIST === 'undefined') return;

  container.innerHTML = SKILLS_LIST.map(skill => `
    <div class="group bg-white p-5 rounded-2xl border border-slate-200/90 hover:border-blue-500 hover:shadow-xl transition-all duration-300 flex flex-col justify-between cursor-pointer" onclick="filterBySkill('${skill.name}')">
      <div>
        <div class="flex items-center justify-between mb-3">
          <span class="text-3xl">${skill.icon}</span>
          <span class="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-100 uppercase tracking-wider">${skill.badge}</span>
        </div>
        <h4 class="text-base font-extrabold text-slate-900 group-hover:text-blue-600 transition-colors">${skill.name}</h4>
        <span class="text-[11px] font-semibold text-slate-400 block mb-2">${skill.category}</span>
        <p class="text-xs text-slate-600 leading-relaxed">${skill.desc}</p>
      </div>
      <div class="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
        <span class="text-xs font-bold text-blue-600 group-hover:text-blue-700 flex items-center gap-1">
          Explore Related Courses <span class="group-hover:translate-x-1 transition-transform">→</span>
        </span>
      </div>
    </div>
  `).join('');
}

function filterBySkill(skillName) {
  const searchInput = document.getElementById('course-search');
  if (searchInput) {
    searchInput.value = skillName;
    searchInput.dispatchEvent(new Event('input'));
  }
  const courseSection = document.getElementById('courses-section');
  if (courseSection) {
    courseSection.scrollIntoView({ behavior: 'smooth' });
  }
  showToast(`Filtering courses for "${skillName}"...`, 'info');
}

// 3. Course Details & Syllabus Modal
function openCourseDetails(courseId) {
  const course = COURSES_DATA.find(c => c.id === courseId);
  if (!course) return;

  const modal = document.getElementById('course-modal');
  const modalContent = document.getElementById('course-modal-content');
  if (!modal || !modalContent) return;

  const curriculumHtml = course.curriculum.map((m, idx) => `
    <div class="border border-slate-200 rounded-xl overflow-hidden mb-3">
      <div class="bg-slate-50 px-4 py-3 flex items-center justify-between font-bold text-slate-800 text-sm">
        <span>${m.module}</span>
        <span class="text-xs bg-blue-100 text-blue-700 px-2.5 py-0.5 rounded-full font-semibold">${m.duration}</span>
      </div>
      <div class="p-4 bg-white text-xs text-slate-600 space-y-1.5">
        <ul class="list-disc list-inside space-y-1">
          ${m.topics.map(t => `<li>${t}</li>`).join('')}
        </ul>
      </div>
    </div>
  `).join('');

  const hasProjects = course.projects && course.projects.length > 0;
  const projectsHtml = hasProjects ? course.projects.map(p => `
    <div class="p-3 bg-emerald-50/70 border border-emerald-200 rounded-xl text-xs font-semibold text-emerald-950 flex items-start gap-2">
      <svg class="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
      <span>${p}</span>
    </div>
  `).join('') : '';

  modalContent.innerHTML = `
    <!-- Header -->
    <div class="p-6 bg-slate-900 text-white rounded-t-2xl relative">
      <button onclick="closeCourseModal()" class="absolute top-5 right-5 text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-700 rounded-full p-2 transition">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
      </button>
      <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-semibold mb-3 border border-blue-400/30">
        <span>★ ${course.badge}</span> • <span>${course.duration}</span>
      </div>
      <h2 class="text-2xl lg:text-3xl font-extrabold text-white">${course.title}</h2>
      <p class="text-slate-300 text-sm mt-2 max-w-2xl leading-relaxed">${course.overview}</p>

      <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-5 border-t border-slate-800 text-xs">
        <div>
          <span class="text-slate-400 block">Training Mode</span>
          <span class="font-bold text-white">${course.mode.split('(')[0]}</span>
        </div>
        <div>
          <span class="text-slate-400 block">Program Duration</span>
          <span class="font-bold text-white">${course.duration}</span>
        </div>
        <div>
          <span class="text-slate-400 block">Course Fee (₹)</span>
          <span class="font-bold text-emerald-400 text-base">₹${course.discountedFee.toLocaleString('en-IN')}</span>
          <span class="text-[10px] text-amber-300 font-bold block mt-0.5">+ 18% GST Applicable</span>
        </div>
        <div>
          <span class="text-slate-400 block">Payment Plan</span>
          <span class="font-bold text-blue-400 text-sm">2 Easy Milestones</span>
          <span class="text-[10px] text-slate-300 block mt-0.5">Pay in 2 Equal Parts</span>
        </div>
      </div>
    </div>

    <!-- Body Tabs / Content -->
    <div class="p-6 max-h-[70vh] overflow-y-auto space-y-6">
      <!-- Curriculum Section -->
      <div>
        <h4 class="text-base font-bold text-slate-900 mb-3 flex items-center gap-2">
          <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path></svg>
          Comprehensive Week-by-Week Syllabus
        </h4>
        <div class="space-y-2">
          ${curriculumHtml}
        </div>
      </div>

      <!-- Real-World Capstone Projects (if applicable) -->
      ${hasProjects ? `
      <div>
        <h4 class="text-base font-bold text-slate-900 mb-3 flex items-center gap-2">
          <svg class="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"></path></svg>
          Industry Capstone Projects You Will Build
        </h4>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
          ${projectsHtml}
        </div>
      </div>` : ''}

      <!-- Tools & Technologies -->
      <div>
        <h4 class="text-sm font-bold text-slate-900 mb-2">Technologies & Frameworks Covered</h4>
        <div class="flex flex-wrap gap-2">
          ${course.tools.map(t => `<span class="px-3 py-1 bg-slate-100 text-slate-800 text-xs font-semibold rounded-lg border border-slate-200">${t}</span>`).join('')}
        </div>
      </div>

      <!-- Top Hiring Partners -->
      <div class="bg-blue-50/60 p-4 rounded-xl border border-blue-100">
        <h4 class="text-xs font-bold text-blue-900 uppercase tracking-wider mb-2">Hiring Partners for this track</h4>
        <div class="flex flex-wrap items-center gap-3">
          ${course.hirers.map(h => `<span class="px-3 py-1 bg-white font-bold text-slate-800 text-xs rounded-md shadow-sm border border-slate-200">${h}</span>`).join('')}
        </div>
      </div>
    </div>

    <!-- Footer Actions -->
    <div class="p-4 sm:p-6 bg-slate-50 rounded-b-2xl border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
      <div>
        <div class="text-xs text-slate-500 font-medium">Batch starting: <span class="font-bold text-slate-800">${course.nextBatch}</span></div>
        <div class="text-xs text-emerald-600 font-semibold">Limited interactive seats available for this batch</div>
      </div>
      <div class="flex flex-col sm:flex-row items-center gap-2.5 sm:gap-3 w-full sm:w-auto">
        <button onclick="downloadSyllabusWithAuth('${course.id}')" class="w-full sm:w-auto px-4 py-2.5 bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs font-bold rounded-xl transition flex items-center justify-center gap-2">
          <svg class="w-4 h-4 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
          <span>Download Full Syllabus</span>
        </button>
        <button onclick="quickEnroll('${course.id}'); closeCourseModal();" class="w-full sm:w-auto px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-lg shadow-blue-500/20 transition text-center justify-center flex items-center">
          <span>Enroll Now & Reserve Seat</span>
        </button>
      </div>
    </div>
  `;

  modal.classList.remove('hidden');
  document.body.style.overflow = 'hidden';
}

function closeCourseModal() {
  const modal = document.getElementById('course-modal');
  if (modal) {
    modal.classList.add('hidden');
    document.body.style.overflow = '';
  }
}

// 4. Quick Enroll Link to Form
function quickEnroll(courseId) {
  const courseSelect = document.getElementById('form-course');
  if (courseSelect) {
    courseSelect.value = courseId;
  }
  const formSection = document.getElementById('admissions-section');
  if (formSection) {
    formSection.scrollIntoView({ behavior: 'smooth' });
    const nameInput = document.getElementById('form-name');
    if (nameInput) nameInput.focus();
  }
}

function downloadSyllabusPrompt(courseIdOrTitle) {
  downloadSyllabusWithAuth(courseIdOrTitle);
}

// 5. Lead Capture & Admission Form Handler
function initAdmissionForm() {
  const form = document.getElementById('admission-form');
  if (!form) return;

  // Populate course dropdown if empty
  const courseSelect = document.getElementById('form-course');
  if (courseSelect && courseSelect.options.length <= 1) {
    COURSES_DATA.forEach(c => {
      const opt = document.createElement('option');
      opt.value = c.id;
      opt.textContent = `${c.title} (₹${c.discountedFee.toLocaleString('en-IN')} + 18% GST)`;
      courseSelect.appendChild(opt);
    });
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = document.getElementById('form-name')?.value.trim();
    const countryCode = document.getElementById('form-country')?.value ?? '+91';
    const rawPhone = document.getElementById('form-phone')?.value.trim();
    const email = document.getElementById('form-email')?.value.trim();
    const courseId = document.getElementById('form-course')?.value;
    const batchSchedule = document.getElementById('form-batch')?.value || document.getElementById('form-campus')?.value;
    const qualification = document.getElementById('form-qualification')?.value;
    const message = document.getElementById('form-message')?.value.trim() || 'Interested in joining upcoming batch.';

    // Validation
    if (!name || name.length < 2) {
      showToast('Please enter your full name.', 'error');
      return;
    }

    const normalizedPhone = normalizePhoneNumber(rawPhone, countryCode);
    if (!normalizedPhone.valid) {
      showToast('Enter 8–15 digits. For Other, include the full number starting with + and its country code.', 'error');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showToast('Please enter a valid email address.', 'error');
      return;
    }

    if (!courseId) {
      showToast('Please select your preferred course.', 'error');
      return;
    }

    const selectedCourse = COURSES_DATA.find(c => c.id === courseId);
    const courseName = selectedCourse ? selectedCourse.title : courseId;
    const formattedPhone = normalizedPhone.phone;

    // Register candidate profile for brochure and curriculum access
    saveCandidateRegistration({
      name,
      phone: formattedPhone,
      email,
      courseId,
      courseTitle: courseName,
      batchSchedule: batchSchedule || 'Weekday Evening (7:30 PM - 9:30 PM IST)',
      qualification: qualification || 'Graduate'
    });

    // Submit the inquiry through FormSubmit and wait for its receipt status.
    const deliverySucceeded = await deliverLeadToBackend({
      name,
      phone: formattedPhone,
      email,
      courseTitle: courseName,
      batchSchedule: batchSchedule || 'Weekday Evening (7:30 PM - 9:30 PM IST)',
      qualification: qualification || 'Graduate',
      message
    });

    showToast(
      deliverySucceeded
        ? `Thank you, ${name}! Your inquiry was delivered to our Admissions Desk.`
        : 'We could not confirm delivery. Please use WhatsApp below to contact admissions.',
      deliverySucceeded ? 'success' : 'error'
    );

    // Show Confirmation Dialog with direct WhatsApp Option
    showConfirmationModal({
      name,
      phone: formattedPhone,
      email,
      courseName,
      batchSchedule: batchSchedule || 'Weekday Evening (7:30 PM - 9:30 PM IST)',
      qualification: qualification || 'Graduate',
      deliverySucceeded
    });

    form.reset();
  });
}

function showConfirmationModal(data) {
  let modal = document.getElementById('success-modal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'success-modal';
    modal.className = 'fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm';
    document.body.appendChild(modal);
  }

  const phoneDisplay = data.phone || '';
  const phoneFormatted = phoneDisplay.trim().startsWith('+') ? phoneDisplay.trim() : `+91 ${phoneDisplay.trim()}`;
  const deliverySucceeded = data.deliverySucceeded === true;

  const encodedMsg = encodeURIComponent(
    `Hello ThinkToSkill Virtual Academy Admissions Team,\nMy name is ${data.name}.\nI just submitted an inquiry for: *${data.courseName}*.\nPhone: ${phoneFormatted}\nPreferred Batch (100% Live Online): ${data.batchSchedule || data.campus || 'Weekday Evening'}\nQualification: ${data.qualification}.\nPlease share the brochure, syllabus, and batch details.`
  );
  const waUrl = `https://wa.me/918825808110?text=${encodedMsg}`;

  modal.innerHTML = `
    <div class="bg-white rounded-3xl max-w-lg w-full p-5 sm:p-8 text-center shadow-2xl relative border border-slate-100 max-h-[92vh] overflow-y-auto my-auto">
      <div class="w-16 h-16 ${deliverySucceeded ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-700'} rounded-full flex items-center justify-center mx-auto mb-4">
        <svg class="w-9 h-9" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="${deliverySucceeded ? 'M5 13l4 4L19 7' : 'M12 8v4m0 4h.01'}"></path></svg>
      </div>

      <span class="px-3 py-1 ${deliverySucceeded ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'} text-xs font-bold rounded-full uppercase tracking-wider">${deliverySucceeded ? 'Inquiry Delivered' : 'Delivery Not Confirmed'}</span>
      <h3 class="text-2xl font-extrabold text-slate-900 mt-2">${deliverySucceeded ? 'Inquiry Submitted' : 'Inquiry Not Confirmed'}</h3>
      <p class="text-sm text-slate-600 mt-2 leading-relaxed">
        Dear <span class="font-bold text-slate-800">${escapeHTML(data.name)}</span>, your inquiry for <strong>${escapeHTML(data.courseName)}</strong>. ${deliverySucceeded ? 'The Admissions Desk confirmed receipt.' : 'We could not confirm receipt. Please use WhatsApp below to contact admissions.'}
      </p>

      <div class="mt-5 p-4 bg-slate-50 rounded-2xl text-left border border-slate-200 text-xs space-y-2">
        <div class="flex justify-between"><span class="text-slate-500">Contact Number:</span> <span class="font-bold text-slate-800">${escapeHTML(phoneFormatted)}</span></div>
        <div class="flex justify-between"><span class="text-slate-500">Learning Mode:</span> <span class="font-bold text-emerald-600">100% Live Virtual Interactive (Pan-India)</span></div>
        <div class="flex justify-between"><span class="text-slate-500">Batch Schedule:</span> <span class="font-bold text-slate-800">${escapeHTML(data.batchTiming || data.batchSchedule || 'Flexible (Morning / Evening / Weekend IST)')}</span></div>
        <div class="flex justify-between"><span class="text-slate-500">Next Step:</span> <span class="font-bold text-blue-600">${deliverySucceeded ? 'Await counselor contact or connect on WhatsApp' : 'Send your inquiry through WhatsApp'}</span></div>
      </div>

      <div class="mt-6 flex flex-col sm:flex-row gap-3">
        <a href="${waUrl}" target="_blank" rel="noopener noreferrer" class="flex-1 py-3 px-4 bg-[#25D366] hover:bg-[#20ba59] text-white font-bold text-sm rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 transition">
          <svg class="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.299.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.353.101.173.45 1.05 1.341 1.574.654.384 1.026.435 1.189.508.163.072.26-.015.347-.116.087-.101.376-.434.477-.579.101-.145.202-.116.347-.058.145.058.924.434 1.083.508.159.072.26.116.303.173.044.058.044.405-.1.81z"/></svg>
          Chat with Counselor on WhatsApp
        </a>
        <button onclick="document.getElementById('success-modal').classList.add('hidden')" class="px-5 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm rounded-xl transition">
          Done
        </button>
      </div>
    </div>
  `;
}

// 6. Transparent Fee Policy (No Hidden Costs)

// 7. FAQ Accordion
function initFaqAccordion() {
  const container = document.getElementById('faq-accordion');
  if (!container) return;

  container.innerHTML = FAQS.map((faq, idx) => `
    <div class="border border-slate-200 rounded-2xl overflow-hidden bg-white transition shadow-sm hover:border-blue-300">
      <button onclick="toggleFaq(${idx})" aria-expanded="false" aria-controls="faq-content-${idx}" class="w-full text-left p-5 flex items-center justify-between font-bold text-slate-900 text-sm sm:text-base gap-4">
        <span>${faq.q}</span>
        <svg id="faq-icon-${idx}" class="w-5 h-5 text-blue-600 transform transition-transform duration-200 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
      </button>
      <div id="faq-content-${idx}" role="region" class="hidden px-5 pb-5 text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
        ${faq.a}
      </div>
    </div>
  `).join('');
}

function toggleFaq(idx) {
  const content = document.getElementById(`faq-content-${idx}`);
  const icon = document.getElementById(`faq-icon-${idx}`);
  if (!content) return;

  const isHidden = content.classList.contains('hidden');
  content.classList.toggle('hidden');
  const btn = content.previousElementSibling;
  if (btn) btn.setAttribute('aria-expanded', isHidden ? 'true' : 'false');

  if (icon) {
    if (isHidden) {
      icon.classList.add('rotate-180');
    } else {
      icon.classList.remove('rotate-180');
    }
  }
}

// 8. 100% Live Virtual Learning Features
function initVirtualFeatures() {
  const container = document.getElementById('virtual-features-container');
  if (!container || typeof VIRTUAL_LEARNING_PILLARS === 'undefined') return;

  container.innerHTML = VIRTUAL_LEARNING_PILLARS.map(item => `
    <div class="bg-white rounded-3xl border border-slate-200 p-8 flex flex-col justify-between hover:border-blue-400 hover:shadow-xl transition-all duration-300">
      <div>
        <div class="flex items-center justify-between mb-5">
          <span class="text-4xl">${item.icon}</span>
          <span class="px-3 py-1 text-[10px] font-extrabold rounded-full bg-blue-50 text-blue-700 border border-blue-100 uppercase tracking-wider">${item.badge}</span>
        </div>
        <h4 class="text-lg font-black text-slate-900 mb-2">${item.title}</h4>
        <p class="text-xs text-slate-600 leading-relaxed">${item.desc}</p>
      </div>
      <div class="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
        <span class="text-xs font-bold text-emerald-600 flex items-center gap-1.5">
          <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          Live Virtual Portal
        </span>
        <button onclick="openDirectWhatsApp('${item.title}')" class="text-xs font-bold text-blue-600 hover:text-blue-800">
          Inquire →
        </button>
      </div>
    </div>
  `).join('');
}

// 9. Testimonials
function initTestimonials() {
  const container = document.getElementById('testimonials-container');
  if (!container) return;

  container.innerHTML = TESTIMONIALS.map(t => `
    <div class="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col justify-between hover:shadow-xl transition-all duration-300">
      <div>
        <div class="flex items-center gap-3 mb-4">
          <img src="${t.image}" alt="${t.name}" class="w-12 h-12 rounded-full object-cover border-2 border-blue-500 shadow-sm" />
          <div>
            <h5 class="text-sm font-bold text-slate-900">${t.name}</h5>
            <p class="text-xs text-blue-600 font-semibold">${t.role}</p>
            <p class="text-[11px] text-slate-400">${t.batchMode || '100% Live Virtual Batch'}</p>
          </div>
        </div>
        <p class="text-xs text-slate-600 italic leading-relaxed mb-4">"${t.quote}"</p>
      </div>
      <div class="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
        <div>
          <span class="text-slate-400 block text-[10px]">Previous Background</span>
          <span class="font-medium text-slate-700 text-[11px]">${t.previous}</span>
        </div>
        <div class="text-right">
          <span class="text-slate-400 block text-[10px]">Offer Secured</span>
          <span class="font-extrabold text-emerald-600 text-xs">${t.package}</span>
        </div>
      </div>
    </div>
  `).join('');
}

// 10. Mobile Menu Toggle
function initMobileMenu() {
  const btn = document.getElementById('mobile-menu-btn');
  const menu = document.getElementById('mobile-menu');
  if (!btn || !menu) return;

  btn.addEventListener('click', () => {
    menu.classList.toggle('hidden');
  });

  const links = menu.querySelectorAll('a');
  links.forEach(l => {
    l.addEventListener('click', () => menu.classList.add('hidden'));
  });
}

// 10b. Active Navigation Tab Highlighting System
function initActiveNavTabs() {
  const currentPath = window.location.pathname.toLowerCase();
  const currentHash = window.location.hash.toLowerCase();

  // Determine current active section/page identifier
  let activeTabKey = 'home';
  if (currentPath.includes('courses.html')) {
    activeTabKey = 'programs';
  } else if (currentPath.includes('brochures.html')) {
    activeTabKey = 'brochures';
  } else if (currentPath.includes('admissions.html')) {
    activeTabKey = 'admissions';
  } else if (currentHash.includes('virtual-section')) {
    activeTabKey = 'virtual';
  } else if (currentHash.includes('courses-section')) {
    activeTabKey = 'programs';
  } else {
    activeTabKey = 'home';
  }

  function applyActiveTab(key) {
    if (!key) return;
    const desktopLinks = document.querySelectorAll('.nav-tab-link');
    const mobileLinks = document.querySelectorAll('.mobile-nav-tab-link');

    desktopLinks.forEach(link => {
      const navKey = link.getAttribute('data-nav');
      if (navKey === key) {
        link.classList.add('active');
        link.setAttribute('aria-current', 'page');
      } else {
        link.classList.remove('active');
        link.removeAttribute('aria-current');
      }
    });

    mobileLinks.forEach(link => {
      const navKey = link.getAttribute('data-nav');
      if (navKey === key) {
        link.classList.add('active');
        link.setAttribute('aria-current', 'page');
      } else {
        link.classList.remove('active');
        link.removeAttribute('aria-current');
      }
    });
  }

  // Initial application on page load
  applyActiveTab(activeTabKey);

  // Instant feedback on click
  document.querySelectorAll('.nav-tab-link, .mobile-nav-tab-link').forEach(link => {
    link.addEventListener('click', function() {
      const key = this.getAttribute('data-nav');
      if (key) {
        applyActiveTab(key);
      }
    });
  });

  // Listen to hash changes (e.g. back/forward button or anchor clicks)
  window.addEventListener('hashchange', () => {
    const hash = window.location.hash.toLowerCase();
    if (hash.includes('virtual-section')) {
      applyActiveTab('virtual');
    } else if (hash.includes('courses-section')) {
      applyActiveTab('programs');
    }
  });

  // In-page scroll spy for index.html
  if (activeTabKey === 'home' || activeTabKey === 'virtual' || activeTabKey === 'programs') {
    const virtualSection = document.getElementById('virtual-section');
    if (virtualSection && 'IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting && entry.intersectionRatio > 0.25) {
            applyActiveTab('virtual');
          } else if (window.scrollY < 400 && !window.location.hash.includes('courses-section')) {
            applyActiveTab('home');
          }
        });
      }, { threshold: [0.25] });
      observer.observe(virtualSection);
    }
  }
}

// 11. Global Toast System
function showToast(message, type = 'info') {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  const bg = type === 'success' ? 'bg-emerald-600 text-white' : type === 'error' ? 'bg-rose-600 text-white' : 'bg-slate-900 text-white';
  toast.className = `toast px-5 py-3 rounded-xl shadow-2xl text-xs font-semibold flex items-center justify-between gap-3 ${bg}`;

  const span = document.createElement('span');
  span.textContent = message;
  const closeBtn = document.createElement('button');
  closeBtn.className = 'ml-2 opacity-75 hover:opacity-100 text-white font-bold';
  closeBtn.setAttribute('aria-label', 'Close notification');
  closeBtn.textContent = '×';
  closeBtn.onclick = () => toast.remove();

  toast.appendChild(span);
  toast.appendChild(closeBtn);

  container.appendChild(toast);
  setTimeout(() => toast.classList.add('show'), 20);

  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 400);
  }, 4500);
}

// 12. Direct WhatsApp Trigger Buttons
function setupWhatsAppTriggers() {
  window.openDirectWhatsApp = function(topic = 'Admissions') {
    const text = encodeURIComponent(`Hi ThinkToSkill team, I am interested in joining a course. Please connect me with a senior counselor regarding ${topic}.`);
    window.open(`https://wa.me/918825808110?text=${text}`, '_blank');
  };
}

// 13. ACTE-Style Hero Instant Course Search Autocomplete
function initHeroSearchAutocomplete() {
  const searchInput = document.getElementById('hero-search-input');
  const dropdown = document.getElementById('hero-search-dropdown');
  if (!searchInput || !dropdown) return;

  searchInput.addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase().trim();
    if (query.length < 1) {
      dropdown.classList.add('hidden');
      dropdown.innerHTML = '';
      return;
    }

    const matchedCourses = COURSES_DATA.filter(c => 
      c.title.toLowerCase().includes(query) ||
      c.tools.some(t => t.toLowerCase().includes(query)) ||
      c.shortDesc.toLowerCase().includes(query) ||
      c.careerRoles.some(r => r.toLowerCase().includes(query))
    );

    if (matchedCourses.length === 0) {
      dropdown.innerHTML = `
        <div class="p-4 text-center text-xs text-slate-500">
          No courses matching "<strong>${escapeHTML(query)}</strong>". Try searching for <em>Python</em>, <em>AWS</em>, <em>Data Science</em>, or <em>Power BI</em>.
        </div>
      `;
      dropdown.classList.remove('hidden');
      return;
    }

    dropdown.innerHTML = `
      <div class="p-2 border-b border-slate-100 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
        Matching Programs (${matchedCourses.length})
      </div>
      <div class="divide-y divide-slate-100 max-h-72 overflow-y-auto">
        ${matchedCourses.map(c => `
          <div onclick="selectSearchCourse('${c.id}')" class="p-3 hover:bg-blue-50/80 cursor-pointer transition flex items-center justify-between gap-3 text-left group">
            <div class="flex-1">
              <div class="flex items-center gap-2 mb-1">
                <span class="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 uppercase">${c.badge}</span>
                <span class="text-[11px] text-slate-400 font-medium">${c.duration}</span>
              </div>
              <h5 class="text-xs font-bold text-slate-900 group-hover:text-blue-600 transition-colors">${c.title}</h5>
              <div class="text-[11px] text-slate-500 mt-0.5">Tools: ${c.tools.slice(0, 4).join(', ')}</div>
            </div>
            <div class="text-right">
              <div class="text-xs font-black text-slate-900">₹${c.discountedFee.toLocaleString('en-IN')}</div>
              <div class="text-[9px] text-amber-700 font-semibold">+ 18% GST</div>
              <span class="text-[10px] font-bold text-blue-600 flex items-center justify-end gap-0.5 mt-0.5">
                View →
              </span>
            </div>
          </div>
        `).join('')}
      </div>
    `;
    dropdown.classList.remove('hidden');
  });

  // Hide dropdown on outside click
  document.addEventListener('click', (e) => {
    if (!searchInput.contains(e.target) && !dropdown.contains(e.target)) {
      dropdown.classList.add('hidden');
    }
  });
}

function selectSearchCourse(courseId) {
  const dropdown = document.getElementById('hero-search-dropdown');
  if (dropdown) dropdown.classList.add('hidden');

  const courseSection = document.getElementById('courses-section');
  if (courseSection) {
    courseSection.scrollIntoView({ behavior: 'smooth' });
  }

  setTimeout(() => {
    openCourseDetails(courseId);
  }, 400);
}

function setHeroSearchQuery(keyword) {
  const heroInput = document.getElementById('hero-search-input');
  if (heroInput) {
    heroInput.value = keyword;
    heroInput.dispatchEvent(new Event('input'));
    heroInput.focus();
  }
}

// 14. Modes of Virtual Training (ACTE Style)
function initTrainingModes() {
  const container = document.getElementById('training-modes-container');
  if (!container || typeof TRAINING_MODES === 'undefined') return;

  container.innerHTML = TRAINING_MODES.map((mode, idx) => `
    <div class="bg-white rounded-3xl p-7 border border-slate-200/90 shadow-sm hover:shadow-xl hover:border-blue-400 transition-all duration-300 flex flex-col justify-between">
      <div>
        <div class="flex items-center justify-between gap-2 mb-4">
          <span class="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-black text-lg">
            0${idx + 1}
          </span>
          <span class="text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full ${
            idx === 0 ? 'bg-amber-100 text-amber-900' : 'bg-blue-100 text-blue-800'
          }">
            ★ ${mode.badge}
          </span>
        </div>

        <h4 class="text-lg font-black text-slate-900 mb-2">${mode.title}</h4>
        <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-50 border border-slate-200 text-slate-700 text-xs font-semibold mb-4 w-full">
          <svg class="w-3.5 h-3.5 text-blue-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          <span class="truncate">${mode.timing}</span>
        </div>

        <p class="text-xs text-slate-500 mb-4 font-medium">${mode.audience}</p>

        <ul class="space-y-2 text-xs text-slate-600 border-t border-slate-100 pt-3">
          ${mode.features.map(f => `
            <li class="flex items-start gap-2">
              <svg class="w-3.5 h-3.5 text-emerald-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
              <span>${f}</span>
            </li>
          `).join('')}
        </ul>
      </div>

      <div class="pt-6 mt-6 border-t border-slate-100">
        <button onclick="goToAdmissions(null, '${mode.title}')" class="w-full py-2.5 px-4 bg-slate-50 hover:bg-blue-600 hover:text-white text-slate-800 font-bold text-xs rounded-xl border border-slate-200 hover:border-transparent transition text-center">
          Inquire This Schedule →
        </button>
      </div>
    </div>
  `).join('');
}

// 15. Free Add-On Benefits You'll Gain (ACTE Style Signature)
function initFreeAddonBenefits() {
  const container = document.getElementById('free-benefits-container');
  if (!container || typeof FREE_ADDON_BENEFITS === 'undefined') return;

  container.innerHTML = FREE_ADDON_BENEFITS.map(b => `
    <div class="bg-white rounded-2xl p-6 border border-slate-200/90 hover:border-emerald-300 hover:shadow-lg transition-all duration-300 flex flex-col justify-between">
      <div>
        <div class="flex items-center justify-between mb-3">
          <span class="text-[11px] font-extrabold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 uppercase tracking-wider">
            ${b.tag}
          </span>
          <span class="text-xs font-bold text-slate-400 line-through">${b.value}</span>
        </div>
        <h4 class="text-base font-extrabold text-slate-900 mb-2">${b.title}</h4>
        <p class="text-xs text-slate-600 leading-relaxed">${b.desc}</p>
      </div>
      <div class="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] font-bold text-emerald-600">
        <span>Included with All 6 Core Programs</span>
        <svg class="w-4 h-4 text-emerald-500" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path></svg>
      </div>
    </div>
  `).join('');
}

// 16. Syllabus Download Modal
let activeSyllabusCourse = null;

// Course Visual Brochure Image Mapping
const COURSE_BROCHURE_MAP = {
  'data-analytics-bi': 'assets/brochures/brochure-data-analytics.png',
  'data-science-ml': 'assets/brochures/brochure-data-science.png',
  'ai-deep-learning': 'assets/brochures/brochure-ai-deep-learning.png',
  'cloud-devops-aws': 'assets/brochures/brochure-cloud-devops.png',
  'python-sql-foundations': 'assets/brochures/brochure-python-sql.png',
  'complete-ai-cloud-diploma': 'assets/brochures/brochure-diploma-architect.png',
  'sap-s4-hana-finance': 'assets/brochures/brochure-sap-finance.png',
  'sap-s4-hana-mm': 'assets/brochures/brochure-sap-mm.png',
  'sap-s4-hana-integrated': 'assets/brochures/brochure-sap-integrated.png'
};

function openSyllabusModal(courseId) {
  const course = COURSES_DATA.find(c => c.id === courseId) || COURSES_DATA[0];
  activeSyllabusCourse = course;
  const brochureImg = COURSE_BROCHURE_MAP[course.id] || 'assets/brochures/brochure-data-analytics.png';
  const registered = isCandidateRegistered();
  const candidate = getCandidateData();

  let modal = document.getElementById('syllabus-modal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'syllabus-modal';
    modal.className = 'fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm';
    document.body.appendChild(modal);
  }

  const registeredBanner = (registered && candidate) ? `
    <div class="mb-4 p-3 bg-emerald-50 rounded-2xl border border-emerald-200 flex items-center justify-between gap-3 text-xs">
      <div class="flex items-center gap-2">
        <span class="w-6 h-6 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold text-xs">✓</span>
        <div>
          <span class="font-bold text-emerald-950">Registration Session Active</span>
          <span class="text-emerald-700 block text-[11px]">${escapeHTML(candidate.name && candidate.name !== 'Registered Candidate' ? candidate.name : 'Candidate')} (${escapeHTML(candidate.phone || 'Current session')})</span>
        </div>
      </div>
      <span class="px-2.5 py-1 bg-emerald-100 text-emerald-800 text-[10px] font-black rounded-full uppercase">Instant Access</span>
    </div>
  ` : `
    <div class="mb-4 p-3 bg-amber-50 rounded-2xl border border-amber-200 text-xs">
      <div class="flex items-center gap-2 mb-1">
        <span class="w-5 h-5 rounded-md bg-amber-500 text-slate-950 flex items-center justify-center font-black text-[11px]">🔒</span>
        <span class="font-bold text-amber-950">Student Registration Required</span>
      </div>
      <p class="text-[11px] text-amber-800 leading-relaxed">
            Registration can prefill your inquiry details. Brochure files are public and are not protected by this browser-only prompt.
      </p>
    </div>
  `;

  modal.innerHTML = `
    <div class="bg-white rounded-3xl max-w-lg w-full p-5 sm:p-7 shadow-2xl relative border border-slate-200 max-h-[92vh] overflow-y-auto">
      <button onclick="closeSyllabusModal()" class="absolute top-4 right-4 sm:top-5 sm:right-5 text-slate-400 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-full p-2 transition">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
      </button>

      <div class="flex items-center gap-2 mb-2">
        <span class="px-2.5 py-0.5 bg-blue-100 text-blue-800 text-[10px] font-black rounded-full uppercase tracking-wider">Official Curriculum & Brochure Flyer</span>
      </div>
      <h3 class="text-xl font-extrabold text-slate-900">${course.title}</h3>
      <p class="text-xs text-slate-500 mt-1 mb-3">
        Download the official high-resolution brochure flyer image and comprehensive week-by-week curriculum syllabus.
      </p>

      ${registeredBanner}

      <!-- Visual Brochure Banner -->
      <div class="mb-4 bg-slate-900 rounded-2xl p-3 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-md">
        <div class="flex items-center gap-3">
          <img src="${brochureImg}" alt="Visual Flyer" class="w-12 h-16 object-cover rounded-lg border border-slate-700 shadow flex-shrink-0 cursor-pointer" onclick="window.open('${brochureImg}', '_blank')" />
          <div class="text-left">
            <span class="text-[10px] uppercase tracking-wider text-amber-400 font-bold block">Official Image Flyer</span>
            <span class="text-xs font-bold text-white block">High-Resolution Poster</span>
            <span class="text-[11px] text-slate-400">Print & WhatsApp Ready</span>
          </div>
        </div>
        <button type="button" onclick="downloadBrochureWithAuth('${brochureImg}', 'ThinkToSkill_${course.id}_Brochure.png', '${course.title.replace(/'/g, "\\'")}', '${course.id}')" class="w-full sm:w-auto px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs rounded-xl transition flex items-center justify-center gap-1.5 shadow whitespace-nowrap">
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
          <span>Download Image</span>
        </button>
      </div>

      <div class="bg-blue-50/70 p-3.5 rounded-2xl border border-blue-100 text-xs mb-4 space-y-1.5">
        <div class="flex justify-between font-semibold"><span class="text-slate-600">Training Duration:</span> <span class="text-blue-800">${course.duration}</span></div>
        <div class="flex justify-between font-semibold"><span class="text-slate-600">Tuition Fee:</span> <span class="text-slate-900">₹${course.discountedFee.toLocaleString('en-IN')} (+ 18% GST Applicable)</span></div>
        ${course.projects && course.projects.length > 0 ? `<div class="flex justify-between font-semibold"><span class="text-slate-600">Hands-on Projects:</span> <span class="text-emerald-700">${course.projects.length} Real-World Capstones</span></div>` : '<div class="flex justify-between font-semibold"><span class="text-slate-600">Lab & Server Access:</span> <span class="text-emerald-700">24/7 Live GUI & Fiori Cloud Server</span></div>'}
        <div class="flex justify-between font-semibold"><span class="text-slate-600">Tools Covered:</span> <span class="text-slate-800">${course.tools.slice(0, 4).join(', ')}</span></div>
      </div>

      <!-- Action CTAs -->
      <div class="space-y-2.5">
        <button type="button" onclick="closeSyllabusModal(); downloadSyllabusWithAuth('${course.id}')" class="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs rounded-xl shadow-lg shadow-blue-500/25 transition flex items-center justify-center gap-2">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
          <span>${registered ? 'Download Syllabus & Official Brochure (Instant)' : 'Register & Download Syllabus + Brochure'}</span>
        </button>

        <button type="button" onclick="closeSyllabusModal(); shareSyllabusWithAuth('${course.title.replace(/'/g, "\\'")}', '${course.id}')" class="w-full py-3 bg-[#25D366] hover:bg-[#20ba59] text-white font-extrabold text-xs rounded-xl shadow-md transition flex items-center justify-center gap-2">
          <svg class="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.299.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.353.101.173.45 1.05 1.341 1.574.654.384 1.026.435 1.189.508.163.072.26-.015.347-.116.087-.101.376-.434.477-.579.101-.145.202-.116.347-.058.145.058.924.434 1.083.508.159.072.26.116.303.173.044.058.044.405-.1.81z"/></svg>
          <span>${registered ? 'Share Syllabus to WhatsApp' : 'Share to WhatsApp (Registration Required)'}</span>
        </button>

        ${!registered ? `
          <div class="pt-2 text-center">
            <span class="text-xs text-slate-500">Already registered?</span>
      <button type="button" onclick="closeSyllabusModal(); openQuickUnlockModal();" class="text-xs font-bold text-blue-600 hover:underline ml-1">
        Restore This Tab →
            </button>
          </div>
        ` : ''}
      </div>
    </div>
  `;

  modal.classList.remove('hidden');
  document.body.style.overflow = 'hidden';
}

function closeSyllabusModal() {
  const modal = document.getElementById('syllabus-modal');
  if (modal) {
    modal.classList.add('hidden');
    document.body.style.overflow = '';
  }
}

function handleSyllabusFormSubmit(e) {
  if (e) e.preventDefault();
  const course = activeSyllabusCourse || COURSES_DATA[0];
  downloadSyllabusWithAuth(course.id);
}

// 18. Admissions & Enrollment Navigation Helper
function goToAdmissions(courseId, modeTitle) {
  openRegistrationModal(courseId);
}

// Seamless compatibility alias in case of cached triggers
function openFreeDemoModal(courseId, customTitle = null) {
  openRegistrationModal(courseId);
}
function closeFreeDemoModal() {
  closeRegistrationModal();
}

// 19. Registration prompt and temporary session profile
let pendingBrochureDownload = null;
let pendingCandidateAction = null;

// Check whether this tab has a temporary registration profile.
function isCandidateRegistered() {
  return Boolean(getCandidateData());
}

// Retrieve the minimal profile kept for the current tab only.
function getCandidateData() {
  try {
    const raw = sessionStorage.getItem(CANDIDATE_SESSION_KEY);
    const candidate = raw ? JSON.parse(raw) : null;
    if (!candidate || !candidate.phone) return null;

    const normalizedPhone = normalizeStoredPhoneNumber(candidate.phone);
    if (!normalizedPhone.valid) return null;

    return {
      name: String(candidate.name || 'Registered Candidate'),
      phone: normalizedPhone.phone
    };
  } catch (e) {
    return null;
  }
}

// Save candidate registration
function saveCandidateRegistration(data) {
  const normalizedPhone = normalizeStoredPhoneNumber(data.phone);
  if (!normalizedPhone.valid) return false;

  try {
    const profile = {
      name: String(data.name || 'Registered Candidate'),
      phone: normalizedPhone.phone
    };
    sessionStorage.setItem(CANDIDATE_SESSION_KEY, JSON.stringify(profile));
    clearLegacyCandidateStorage();
    updateCandidateAccessUI();
    return true;
  } catch (e) {
    console.error('Failed to save candidate session:', e);
    return false;
  }
}

// Clear candidate registration (switch candidate)
function clearCandidateRegistration() {
  try {
    sessionStorage.removeItem(CANDIDATE_SESSION_KEY);
    clearLegacyCandidateStorage();
  } catch (e) {
    console.error('Failed to clear candidate session:', e);
  }
  updateCandidateAccessUI();
  showToast('Registration session cleared. Register again to restore this tab’s download state.', 'info');
}

// Download brochure with candidate gating
function downloadBrochureWithAuth(brochureUrl, filename, courseTitle, courseId = null) {
  if (isCandidateRegistered()) {
    const candidate = getCandidateData();
    triggerFileDownload(brochureUrl, filename);
    const candidateName = (candidate && candidate.name && candidate.name !== 'Registered Candidate') ? candidate.name : '';
    showToast(`✓ Official brochure downloaded${candidateName ? ` for ${candidateName}` : ''}.`, 'success');
  } else {
    pendingCandidateAction = {
      type: 'download_brochure',
      brochureUrl,
      filename,
      courseTitle,
      courseId
    };
    pendingBrochureDownload = pendingCandidateAction;
    if (typeof window !== 'undefined') {
      window.pendingCandidateAction = pendingCandidateAction;
      window.pendingBrochureDownload = pendingCandidateAction;
    }
    openRegistrationModal(courseId, {
      isBrochureGate: true,
      courseTitle: courseTitle || 'Program'
    });
  }
}

// Download syllabus with candidate gating
function downloadSyllabusWithAuth(courseId) {
  const course = (typeof COURSES_DATA !== 'undefined') 
    ? (COURSES_DATA.find(c => c.id === courseId || c.title === courseId) || COURSES_DATA[0]) 
    : { id: courseId, title: courseId };

  if (isCandidateRegistered()) {
    triggerSyllabusFileDownload(course.id);
    const candidate = getCandidateData();
    const candidateName = (candidate && candidate.name && candidate.name !== 'Registered Candidate') ? candidate.name : '';
    showToast(`✓ Official syllabus downloaded${candidateName ? ` for ${candidateName}` : ''}.`, 'success');
  } else {
    pendingCandidateAction = {
      type: 'download_syllabus',
      courseId: course.id,
      courseTitle: course.title
    };
    if (typeof window !== 'undefined') {
      window.pendingCandidateAction = pendingCandidateAction;
      window.pendingBrochureDownload = null;
    }
    openRegistrationModal(course.id, {
      isSyllabusGate: true,
      courseTitle: course.title
    });
  }
}

// Handler for course card syllabus button click
function handleSyllabusButtonClick(courseId) {
  downloadSyllabusWithAuth(courseId);
}

// Open a prefilled brochure inquiry on WhatsApp.
function shareBrochureWithAuth(courseTitle, courseId = null, imgSrc = null) {
  if (isCandidateRegistered()) {
    const candidate = getCandidateData();
    executeWhatsAppShare('brochure', courseTitle, candidate, imgSrc);
  } else {
    pendingCandidateAction = {
      type: 'share_brochure_whatsapp',
      courseTitle,
      courseId,
      imgSrc
    };
    if (typeof window !== 'undefined') {
      window.pendingCandidateAction = pendingCandidateAction;
      window.pendingBrochureDownload = null;
    }
    openRegistrationModal(courseId, {
      isWhatsAppShareGate: true,
      actionSubject: 'Brochure',
      courseTitle
    });
  }
}

// Open a prefilled syllabus inquiry on WhatsApp.
function shareSyllabusWithAuth(courseTitle, courseId = null) {
  if (isCandidateRegistered()) {
    const candidate = getCandidateData();
    executeWhatsAppShare('syllabus', courseTitle, candidate);
  } else {
    pendingCandidateAction = {
      type: 'share_syllabus_whatsapp',
      courseTitle,
      courseId
    };
    if (typeof window !== 'undefined') {
      window.pendingCandidateAction = pendingCandidateAction;
      window.pendingBrochureDownload = null;
    }
    openRegistrationModal(courseId, {
      isWhatsAppShareGate: true,
      actionSubject: 'Syllabus',
      courseTitle
    });
  }
}

// Execute a pre-filled WhatsApp share using the current tab's registration details.
function executeWhatsAppShare(type, courseTitle, candidate, imgSrc = null) {
  const name = (candidate && candidate.name && candidate.name !== 'Registered Candidate') ? candidate.name : 'Registered Candidate';
  const phone = (candidate && candidate.phone) ? candidate.phone.trim() : '';
  const formattedPhone = phone ? (phone.startsWith('+') ? phone : `+91 ${phone}`) : 'Not provided';
  const city = (candidate && candidate.city) ? `\nLocation: ${candidate.city}` : '';
  const qual = (candidate && candidate.qualification) ? `\nQualification: ${candidate.qualification}` : '';
  const batch = (candidate && candidate.batchSchedule) ? `\nPreferred Batch: ${candidate.batchSchedule}` : '';

  let message = '';
  if (type === 'brochure') {
    message = `Hi ThinkToSkill Admissions Team,\nMy name is ${name} (Registered Candidate).\nWhatsApp Mobile: ${formattedPhone}${city}${qual}${batch}\nI am requesting the official high-resolution brochure flyer and fee details for: *${courseTitle}*.\nPlease share the official brochure and upcoming batch schedule.`;
  } else {
    message = `Hi ThinkToSkill Admissions Team,\nMy name is ${name} (Registered Candidate).\nWhatsApp Mobile: ${formattedPhone}${city}${qual}${batch}\nI am requesting the complete week-by-week syllabus curriculum guide for: *${courseTitle}*.\nPlease share the complete syllabus breakdown and next batch details.`;
  }

  const encoded = encodeURIComponent(message);
  const waUrl = `https://wa.me/918825808110?text=${encoded}`;
  window.open(waUrl, '_blank');
  showToast(`Opening WhatsApp with the inquiry details for ${name}...`, 'success');
}

// Actual programmatic file download trigger
function triggerFileDownload(url, filename) {
  const link = document.createElement('a');
  link.href = url;
  link.download = filename || 'ThinkToSkill_Brochure.png';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// Actual programmatic syllabus file download trigger
function triggerSyllabusFileDownload(courseId) {
  const course = (typeof COURSES_DATA !== 'undefined') 
    ? (COURSES_DATA.find(c => c.id === courseId || c.title === courseId) || COURSES_DATA[0]) 
    : null;
  if (!course) return;

  const capstoneText = course.projects && course.projects.length > 0 
    ? `\n\nREAL-WORLD INDUSTRY CAPSTONES:\n${course.projects.map(p => `- ${p}`).join('\n')}` 
    : '';

  const syllabusContent = `ThinkToSkill Virtual Academy - Official Curriculum Syllabus\n=========================================================\nProgram: ${course.title}\nDuration: ${course.duration}\nTraining Mode: 100% Live Interactive Virtual (Pan-India)\nFee: ₹${course.discountedFee.toLocaleString('en-IN')} + 18% GST Applicable (Direct Milestone Pay: 2 parts available)\n\nKEY TECHNOLOGIES & TOOLS COVERED:\n${course.tools.join(', ')}\n\nWEEK-BY-WEEK CURRICULUM MODULES:\n${course.curriculum.map(m => `\n- ${m.module} (${m.duration}):\n  * ${m.topics.join('\n  * ')}`).join('\n')}${capstoneText}\n\nREPUTED HIRING PARTNERS & PLACEMENT NETWORK:\n${course.hirers.join(', ')}\n\nOfficial Admissions Helpline: +91 88258 08110 | WhatsApp Support: https://wa.me/918825808110\nThinkToSkill Virtual Academy - Premier Tech & ERP Training Academy`;

  const blob = new Blob([syllabusContent], { type: 'text/plain;charset=utf-8' });
  const downloadUrl = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = downloadUrl;
  a.download = `ThinkToSkill_${course.id}_Syllabus_2026.txt`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(downloadUrl), 2000);

  // Trigger visual brochure flyer image download as well
  const brochureImg = COURSE_BROCHURE_MAP[course.id];
  if (brochureImg) {
    setTimeout(() => {
      triggerFileDownload(brochureImg, `ThinkToSkill_${course.id}_Brochure.png`);
    }, 400);
  }
}

// Dispatches any pending action queued prior to candidate registration
function executePendingCandidateAction() {
  const action = pendingCandidateAction || 
    (typeof window !== 'undefined' ? window.pendingCandidateAction : null) || 
    pendingBrochureDownload || 
    (typeof window !== 'undefined' ? window.pendingBrochureDownload : null);

  if (!action) return;

  pendingCandidateAction = null;
  pendingBrochureDownload = null;
  if (typeof window !== 'undefined') {
    window.pendingCandidateAction = null;
    window.pendingBrochureDownload = null;
  }

  const candidate = getCandidateData();

  if (action.type === 'download_brochure' || action.brochureUrl) {
    triggerFileDownload(action.brochureUrl, action.filename);
    showToast(`✓ Registration complete! Official brochure for ${action.courseTitle || 'the course'} downloaded.`, 'success');
  } else if (action.type === 'download_syllabus') {
    triggerSyllabusFileDownload(action.courseId);
    showToast(`✓ Registration complete! Official syllabus and brochure downloaded for ${action.courseTitle || 'the course'}!`, 'success');
  } else if (action.type === 'share_brochure_whatsapp') {
    executeWhatsAppShare('brochure', action.courseTitle, candidate, action.imgSrc);
    showToast('Opening WhatsApp with your brochure inquiry...', 'success');
  } else if (action.type === 'share_syllabus_whatsapp') {
    executeWhatsAppShare('syllabus', action.courseTitle, candidate);
    showToast('Opening WhatsApp with your syllabus inquiry...', 'success');
  }
}

// Initialize popup system
function initRegistrationPopup() {
  injectRegistrationPopupDOM();
  injectFloatingRegistrationButton();
  setupAutoRegistrationPopup();
}

function injectRegistrationPopupDOM() {
  if (document.getElementById('student-reg-modal')) return;

  const modal = document.createElement('div');
  modal.id = 'student-reg-modal';
  modal.className = 'fixed inset-0 z-50 hidden flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm overflow-y-auto';

  modal.innerHTML = `
    <div class="bg-white rounded-3xl max-w-xl w-full p-5 sm:p-8 shadow-2xl relative border border-slate-200 my-auto text-left max-h-[94vh] flex flex-col">
      <!-- Close button -->
      <button type="button" onclick="closeRegistrationModal()" class="absolute top-4 right-4 sm:top-5 sm:right-5 text-slate-400 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-full p-2 transition focus:outline-none" aria-label="Close Registration Form">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
      </button>

      <!-- Header badge & titles -->
      <div class="mb-3 sm:mb-4 pr-8">
        <div id="popup-reg-badge" class="inline-flex items-center gap-1.5 text-[11px] font-extrabold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-md mb-2 border border-blue-100 uppercase tracking-wide">
          <span>🎓 ThinkToSkill Admissions 2026</span>
        </div>
        <h3 id="popup-reg-title" class="text-xl sm:text-2xl font-black text-slate-900 tracking-tight leading-tight">Student Registration Details</h3>
        <p id="popup-reg-desc" class="text-xs text-slate-500 mt-1 leading-relaxed">
          Register for upcoming live interactive batches with transparent milestone fees & 1-on-1 industry mentor guidance.
        </p>
      </div>

      <!-- Quick Unlock Bar for already registered candidates -->
      <div id="popup-quick-unlock-box" class="mb-3 sm:mb-4 p-3 bg-blue-50/90 rounded-2xl border border-blue-200/80 flex flex-col sm:flex-row items-center justify-between gap-2.5 text-xs">
        <div class="flex items-center gap-2">
          <span class="w-6 h-6 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-[11px] flex-shrink-0">✓</span>
          <span class="text-slate-700 font-semibold">Registered in this tab already?</span>
        </div>
        <button type="button" onclick="closeRegistrationModal(); openQuickUnlockModal();" class="w-full sm:w-auto px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-[11px] rounded-lg transition whitespace-nowrap shadow-sm flex items-center justify-center gap-1">
            <span>Restore This Tab</span>
          <span>→</span>
        </button>
      </div>

      <!-- Registration Form -->
      <form onsubmit="handlePopupRegistrationSubmit(event)" class="space-y-3 sm:space-y-3.5 max-h-[64vh] sm:max-h-[68vh] overflow-y-auto pr-1">
        <!-- Student Full Name -->
        <div>
          <label class="block text-xs font-bold text-slate-700 mb-1">Student Full Name *</label>
          <input type="text" id="popup-reg-name" required placeholder="e.g. Rahul Sharma" class="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50 focus:bg-white" />
        </div>

        <!-- Contact: Phone & Email -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label class="block text-xs font-bold text-slate-700 mb-1">WhatsApp / Mobile Number *</label>
            <div class="flex">
              <select id="popup-reg-country" aria-label="Country Code" class="px-2 py-2.5 rounded-l-xl border border-r-0 border-slate-300 bg-slate-100 text-slate-700 text-xs font-bold focus:outline-none">
                <option value="+91" selected>+91 (IN)</option>
                <option value="+1">+1 (US/CA)</option>
                <option value="+44">+44 (UK)</option>
                <option value="+971">+971 (AE)</option>
                <option value="+65">+65 (SG)</option>
                <option value="+61">+61 (AU)</option>
                <option value="other">Other (enter +country code)</option>
              </select>
              <input type="tel" id="popup-reg-phone" required placeholder="Phone number without code" class="w-full px-3 py-2.5 rounded-r-xl border border-slate-300 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50 focus:bg-white" />
            </div>
          </div>
          <div>
            <label class="block text-xs font-bold text-slate-700 mb-1">Email Address *</label>
            <input type="email" id="popup-reg-email" required placeholder="e.g. rahul@gmail.com" class="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50 focus:bg-white" />
          </div>
        </div>

        <!-- Academic & Schedule -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label class="block text-xs font-bold text-slate-700 mb-1">Highest Qualification *</label>
            <select id="popup-reg-qualification" required class="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50 focus:bg-white">
              <option value="B.Tech / B.E (CS / IT)">B.Tech / B.E (CS / IT)</option>
              <option value="B.Tech / B.E (Non-CS)">B.Tech / B.E (Non-CS)</option>
              <option value="BCA / MCA / B.Sc / M.Sc">BCA / MCA / B.Sc / M.Sc</option>
              <option value="Working IT Professional">Working IT Professional</option>
              <option value="Working Non-IT (Switching to Tech)">Working Non-IT (Switching to Tech)</option>
              <option value="Commerce / MBA / Finance">Commerce / MBA / Finance</option>
              <option value="College Student / Fresher">College Student / Fresher</option>
              <option value="Diploma / Other">Diploma / Other</option>
            </select>
          </div>
          <div>
            <label class="block text-xs font-bold text-slate-700 mb-1">Preferred Batch Timing *</label>
            <select id="popup-reg-batch" class="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50 focus:bg-white">
              <option value="Weekday Evening (7:30 PM - 9:30 PM IST)">Weekday Evening (7:30 PM - 9:30 PM IST)</option>
              <option value="Weekday Morning (7:00 AM - 9:00 AM IST)">Weekday Morning (7:00 AM - 9:00 AM IST)</option>
              <option value="Weekend Intensive (Sat & Sun IST)">Weekend Intensive (Sat & Sun IST)</option>
              <option value="Flexible / 1-on-1 Mentor Guidance">Flexible with 1-on-1 Mentorship</option>
            </select>
          </div>
        </div>

        <!-- Course Track -->
        <div>
          <label class="block text-xs font-bold text-slate-700 mb-1">Select Program Track *</label>
          <select id="popup-reg-course" required class="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50 focus:bg-white font-medium">
          </select>
        </div>

        <!-- City / Location -->
        <div>
          <label class="block text-xs font-bold text-slate-700 mb-1">Current City / State (Across India & Global) *</label>
          <input type="text" id="popup-reg-city" required placeholder="e.g. Chennai, Bengaluru, Hyderabad, Pune, Delhi NCR..." class="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50 focus:bg-white" />
        </div>

        <!-- Fee Guarantee Banner -->
        <div class="p-3 bg-amber-50/80 rounded-xl border border-amber-200/80 text-[11px] text-amber-900 flex items-center justify-between gap-2">
          <span class="font-bold">✓ Direct Milestone Payment Option (2 Parts)</span>
          <span class="font-extrabold uppercase text-[10px] bg-amber-200/60 px-2 py-0.5 rounded border border-amber-300">+ 18% GST Applicable</span>
        </div>

        <!-- Submit Button -->
        <div class="pt-2">
          <button type="submit" class="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-black text-xs uppercase tracking-wider shadow-lg shadow-blue-500/25 hover:shadow-blue-500/35 transition flex items-center justify-center gap-2">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            <span id="popup-reg-submit-text">Submit Student Registration Details</span>
          </button>
          <p class="text-[10px] text-slate-500 text-center mt-2">Submitting sends your inquiry through FormSubmit to our admissions email. <a href="privacy.html" class="underline text-blue-600">Privacy Policy</a></p>
          <p class="text-[10px] text-slate-400 text-center mt-2">No loans • No 3rd-party NBFC EMI traps • Official admissions desk +91 88258 08110</p>
        </div>
      </form>
    </div>
  `;

  document.body.appendChild(modal);

  // Close when clicking on backdrop
  modal.addEventListener('click', (e) => {
    if (e.target.id === 'student-reg-modal') {
      closeRegistrationModal();
    }
  });
}

function injectFloatingRegistrationButton() {
  if (document.getElementById('floating-student-reg-btn')) return;

  const btn = document.createElement('button');
  btn.id = 'floating-student-reg-btn';
  btn.type = 'button';
  btn.onclick = () => openRegistrationModal();
  btn.className = 'fixed bottom-3 left-3 sm:bottom-6 sm:left-6 z-40 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-3 py-2 sm:px-4 sm:py-3 rounded-full shadow-2xl flex items-center gap-2 transition transform hover:scale-105 group border border-blue-400/40 text-[11px] sm:text-xs font-extrabold';
  btn.setAttribute('aria-label', 'Open Student Registration Form');

  btn.innerHTML = `
    <span class="flex h-2 w-2 sm:h-2.5 sm:w-2.5 relative">
      <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
      <span class="relative inline-flex rounded-full h-2 w-2 sm:h-2.5 sm:w-2.5 bg-amber-400"></span>
    </span>
    <span class="tracking-wide">📝 Student Registration</span>
  `;

  document.body.appendChild(btn);
}

function setupAutoRegistrationPopup() {
  if (sessionStorage.getItem('tts_reg_modal_seen') === 'true') return;
  // Show popup only after 45 seconds AND user has scrolled 40% of the page
  let scrollTriggered = false;
  let timeTriggered = false;
  const tryShowPopup = () => {
    if (scrollTriggered && timeTriggered && sessionStorage.getItem('tts_reg_modal_seen') !== 'true') {
      openRegistrationModal();
    }
  };
  setTimeout(() => { timeTriggered = true; tryShowPopup(); }, 45000);
  window.addEventListener('scroll', function onScroll() {
    const scrollPercent = (window.scrollY + window.innerHeight) / document.documentElement.scrollHeight;
    if (scrollPercent > 0.4) {
      scrollTriggered = true;
      window.removeEventListener('scroll', onScroll);
      tryShowPopup();
    }
  });
}

function openRegistrationModal(courseId = null, options = {}) {
  let modal = document.getElementById('student-reg-modal');
  if (!modal) {
    injectRegistrationPopupDOM();
    modal = document.getElementById('student-reg-modal');
  }
  if (!modal) return;

  const isBrochureGate = options && options.isBrochureGate;
  const isSyllabusGate = options && options.isSyllabusGate;
  const isWhatsAppShareGate = options && options.isWhatsAppShareGate;
  const actionSubject = (options && options.actionSubject) || 'Brochure & Syllabus';
  const courseTitle = options && options.courseTitle;
  const isUpdate = options && options.isUpdate;

  const badgeEl = document.getElementById('popup-reg-badge');
  const titleEl = document.getElementById('popup-reg-title');
  const descEl = document.getElementById('popup-reg-desc');
  const submitBtnText = document.getElementById('popup-reg-submit-text');
  const quickUnlockBox = document.getElementById('popup-quick-unlock-box');

  if (isWhatsAppShareGate) {
    if (badgeEl) badgeEl.textContent = 'WhatsApp inquiry';
    if (titleEl) titleEl.innerText = actionSubject === 'Syllabus' ? 'Request a Syllabus on WhatsApp' : 'Share Program Details on WhatsApp';
    if (descEl) descEl.textContent = `Register to prefill a WhatsApp inquiry for ${courseTitle || 'your selected program'}. Public brochure files are not protected by this prompt.`;
    if (submitBtnText) submitBtnText.innerText = 'Continue to WhatsApp →';
    if (quickUnlockBox) quickUnlockBox.classList.remove('hidden');
  } else if (isSyllabusGate) {
    if (badgeEl) badgeEl.textContent = 'Syllabus download';
    if (titleEl) titleEl.innerText = 'Download Official Syllabus';
    if (descEl) descEl.textContent = `Submit an inquiry to start a syllabus download for ${courseTitle || 'this course'}. The generated syllabus is public and is not protected by this prompt.`;
    if (submitBtnText) submitBtnText.innerText = 'Continue to Syllabus →';
    if (quickUnlockBox) quickUnlockBox.classList.remove('hidden');
  } else if (isBrochureGate) {
    if (badgeEl) badgeEl.textContent = 'Brochure download';
    if (titleEl) titleEl.innerText = 'Download Official Brochure';
    if (descEl) descEl.textContent = `Submit an inquiry to start a brochure download for ${courseTitle || 'the course brochure'}. Brochure files are public and are not protected by this prompt.`;
    if (submitBtnText) submitBtnText.innerText = 'Continue to Brochure →';
    if (quickUnlockBox) quickUnlockBox.classList.remove('hidden');
  } else if (isUpdate) {
    if (badgeEl) badgeEl.innerHTML = '<span>🎓 ThinkToSkill Candidate Profile</span>';
    if (titleEl) titleEl.innerText = 'Update Registration Details';
    if (descEl) descEl.innerText = 'Update your registered student contact and preferred schedule details below.';
    if (submitBtnText) submitBtnText.innerText = 'Update Registration Details';
    if (quickUnlockBox) quickUnlockBox.classList.add('hidden');
  } else {
    if (badgeEl) badgeEl.innerHTML = '<span>🎓 ThinkToSkill Admissions 2026</span>';
    if (titleEl) titleEl.innerText = 'Student Registration Details';
    if (descEl) descEl.innerText = 'Register for upcoming live interactive batches with transparent milestone fees & 1-on-1 industry mentor guidance.';
    if (submitBtnText) submitBtnText.innerText = 'Submit Student Registration Details';
    if (quickUnlockBox) quickUnlockBox.classList.remove('hidden');
  }

  // Pre-fill if candidate data exists
  const existing = getCandidateData();
  if (existing) {
    if (document.getElementById('popup-reg-name') && existing.name && existing.name !== 'Registered Candidate') {
      document.getElementById('popup-reg-name').value = existing.name;
    }
    if (document.getElementById('popup-reg-phone') && existing.phone) {
      document.getElementById('popup-reg-phone').value = existing.phone;
    }
    if (document.getElementById('popup-reg-email') && existing.email) {
      document.getElementById('popup-reg-email').value = existing.email;
    }
    if (document.getElementById('popup-reg-city') && existing.city) {
      document.getElementById('popup-reg-city').value = existing.city;
    }
  }

  const select = document.getElementById('popup-reg-course');
  if (select && typeof COURSES_DATA !== 'undefined') {
    select.innerHTML = COURSES_DATA.map(c => `
      <option value="${c.id}" ${(courseId === c.id || (existing && existing.courseId === c.id)) ? 'selected' : ''}>
        ${c.title} — ₹${c.discountedFee.toLocaleString('en-IN')} (+ 18% GST)
      </option>
    `).join('');
  }

  modal.classList.remove('hidden');
  document.body.style.overflow = 'hidden';
}

function closeRegistrationModal() {
  const modal = document.getElementById('student-reg-modal');
  if (modal) {
    modal.classList.add('hidden');
    document.body.style.overflow = '';
  }
  sessionStorage.setItem('tts_reg_modal_seen', 'true');
}

async function handlePopupRegistrationSubmit(e) {
  e.preventDefault();
  const name = document.getElementById('popup-reg-name')?.value.trim();
  const countryCode = document.getElementById('popup-reg-country')?.value ?? '+91';
  const rawPhone = document.getElementById('popup-reg-phone')?.value.trim();
  const email = document.getElementById('popup-reg-email')?.value.trim();
  const qualification = document.getElementById('popup-reg-qualification')?.value;
  const courseId = document.getElementById('popup-reg-course')?.value;
  const batchSchedule = document.getElementById('popup-reg-batch')?.value;
  const city = document.getElementById('popup-reg-city')?.value.trim();

  // Validation
  if (!name || name.length < 2) {
    showToast('Please enter your full name.', 'error');
    return;
  }

  const normalizedPhone = normalizePhoneNumber(rawPhone, countryCode);
  if (!normalizedPhone.valid) {
    showToast('Enter 8–15 digits. For Other, include the full number starting with + and its country code.', 'error');
    return;
  }

  const courseObj = (typeof COURSES_DATA !== 'undefined') ? COURSES_DATA.find(c => c.id === courseId) : null;
  const courseTitle = courseObj ? courseObj.title : (courseId || 'Technical Track');
  const formattedPhone = normalizedPhone.phone;

  // Save registered candidate
  saveCandidateRegistration({
    name,
    phone: formattedPhone,
    email,
    qualification,
    courseId,
    courseTitle,
    batchSchedule,
    city
  });

  // Submit the inquiry through FormSubmit and wait for its receipt status.
  const deliverySucceeded = await deliverLeadToBackend({
    name,
    phone: formattedPhone,
    email: email || 'Provided on WhatsApp',
    courseTitle,
    batchSchedule: batchSchedule || 'Weekday Evening',
    qualification,
    city
  });

  closeRegistrationModal();

  // If there was a pending candidate action (brochure, syllabus, or whatsapp share), trigger it immediately!
  executePendingCandidateAction();

  showToast(
    deliverySucceeded
      ? `Thank you, ${name}! Your inquiry was delivered to our Admissions Desk.`
      : 'We could not confirm delivery. Please use WhatsApp below to contact admissions.',
    deliverySucceeded ? 'success' : 'error'
  );

  showConfirmationModal({
    name,
    phone: formattedPhone,
    email: email || 'Provided on WhatsApp',
    courseName: courseTitle,
    batchSchedule: batchSchedule || 'Weekday Evening',
    qualification: `${qualification} (${city || 'India'})`,
    deliverySucceeded
  });

  e.target.reset();
}

// Restore the current tab's temporary registration profile.
function openQuickUnlockModal() {
  let modal = document.getElementById('quick-unlock-modal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'quick-unlock-modal';
    modal.className = 'fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm';
    modal.innerHTML = `
      <div class="bg-white rounded-3xl max-w-md w-full p-5 sm:p-7 shadow-2xl relative border border-slate-200 max-h-[92vh] overflow-y-auto my-auto">
        <button onclick="closeQuickUnlockModal()" class="absolute top-4 right-4 text-slate-400 hover:text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-full p-2 transition">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
        </button>

        <div class="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-3">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
        </div>

        <h3 class="text-xl font-black text-slate-900">Restore Registration Session</h3>
        <p class="text-xs text-slate-500 mt-1 mb-4 leading-relaxed">
          Enter the same phone number to restore registration details saved in this browser tab. This is a convenience feature, not identity verification.
        </p>

        <form onsubmit="handleQuickUnlockSubmit(event)" class="space-y-4">
          <div>
            <label class="block text-xs font-bold text-slate-700 mb-1">Registered Phone Number *</label>
            <div class="flex">
              <select id="quick-unlock-country" aria-label="Country Code" class="px-2 py-2.5 rounded-l-xl border border-r-0 border-slate-300 bg-slate-100 text-slate-700 text-xs font-bold focus:outline-none">
                <option value="+91" selected>+91 (IN)</option>
                <option value="+1">+1 (US/CA)</option>
                <option value="+44">+44 (UK)</option>
                <option value="+971">+971 (AE)</option>
                <option value="+65">+65 (SG)</option>
                <option value="+61">+61 (AU)</option>
                <option value="other">Other (enter +country code)</option>
              </select>
              <input type="tel" id="quick-unlock-phone" required placeholder="Phone number without code" class="w-full p-2.5 rounded-r-xl border border-slate-300 text-xs text-slate-900 font-bold tracking-wider focus:ring-2 focus:ring-blue-500 focus:outline-none" />
            </div>
          </div>

          <button type="submit" class="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs rounded-xl shadow-lg shadow-blue-500/25 transition flex items-center justify-center gap-2">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
        <span>Restore This Tab</span>
          </button>
        </form>

        <div class="mt-4 pt-4 border-t border-slate-100 text-center">
          <span class="text-xs text-slate-500">Not registered yet?</span>
          <button type="button" onclick="closeQuickUnlockModal(); openRegistrationModal();" class="text-xs font-bold text-blue-600 hover:underline ml-1">
            Fill Student Registration Form →
          </button>
        </div>
      </div>
    `;
    document.body.appendChild(modal);
    modal.addEventListener('click', (e) => {
      if (e.target.id === 'quick-unlock-modal') closeQuickUnlockModal();
    });
  }
  modal.classList.remove('hidden');
  document.body.style.overflow = 'hidden';
  setTimeout(() => document.getElementById('quick-unlock-phone')?.focus(), 100);
}

function closeQuickUnlockModal() {
  const modal = document.getElementById('quick-unlock-modal');
  if (modal) {
    modal.classList.add('hidden');
    document.body.style.overflow = '';
  }
}

function handleQuickUnlockSubmit(e) {
  e.preventDefault();
  const countryCode = document.getElementById('quick-unlock-country')?.value ?? '+91';
  const phone = document.getElementById('quick-unlock-phone')?.value.trim();
  quickUnlockWithPhone(phone, countryCode);
}

function quickUnlockWithPhone(phone, countryCode = '+91') {
  const normalizedPhone = normalizePhoneNumber(phone, countryCode);
  if (!normalizedPhone.valid) {
    showToast('Enter 8–15 digits. For Other, include the full number starting with + and its country code.', 'error');
    return false;
  }

  const candidate = getCandidateData();
  const storedPhone = candidate ? normalizeStoredPhoneNumber(candidate.phone) : null;
  if (!storedPhone || !storedPhone.valid || storedPhone.phone !== normalizedPhone.phone) {
    showToast('No matching registration is saved in this browser tab. Please register to continue.', 'error');
    closeQuickUnlockModal();
    openRegistrationModal();
    return false;
  }

  updateCandidateAccessUI();
  showToast('Registration session restored for this browser tab.', 'success');
  closeQuickUnlockModal();
  executePendingCandidateAction();
  return true;
}

// Update UI elements across pages based on candidate registration state
function updateCandidateAccessUI() {
  const registered = isCandidateRegistered();
  const candidate = getCandidateData();

  // 1. Update candidate-access-bar if present on brochures.html
  const bar = document.getElementById('candidate-access-bar');
  if (bar) {
    if (registered && candidate) {
      const displayName = (candidate.name && candidate.name !== 'Registered Candidate') ? candidate.name : 'Registered Candidate';
      const rawPhone = candidate.phone || '';
      const displayPhone = rawPhone ? (rawPhone.startsWith('+') ? rawPhone : `+91 ${rawPhone}`) : 'Verified';
      bar.className = 'mb-8 p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-emerald-950 via-slate-900 to-teal-950 text-white border border-emerald-500/40 shadow-xl flex flex-col md:flex-row items-center justify-between gap-4 transition-all duration-300';
      bar.innerHTML = `
        <div class="flex items-center gap-3.5">
          <div class="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center flex-shrink-0">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          </div>
          <div>
            <div class="flex items-center gap-2">
      <span class="text-[10px] font-black uppercase tracking-wider bg-emerald-500 text-slate-950 px-2 py-0.5 rounded-full">Registration Session Active</span>
              <span class="text-xs text-emerald-400 font-bold">${escapeHTML(displayName)} (${escapeHTML(displayPhone)})</span>
            </div>
            <p class="text-xs text-slate-300 mt-1">
        Name and phone stay in this tab’s session storage until the tab closes. Brochure files are public static assets.
            </p>
          </div>
        </div>
        <div class="flex items-center gap-2 flex-shrink-0 w-full sm:w-auto justify-end">
          <button onclick="openRegistrationModal(null, { isUpdate: true })" class="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs rounded-xl border border-slate-700 font-bold transition">
            Update Details
          </button>
          <button onclick="clearCandidateRegistration()" class="px-3 py-2 text-slate-400 hover:text-red-400 text-xs transition font-semibold" title="Sign out / switch candidate">
            Switch Candidate
          </button>
        </div>
      `;
    } else {
      bar.className = 'mb-8 p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 text-white border border-blue-500/30 shadow-xl flex flex-col md:flex-row items-center justify-between gap-4 transition-all duration-300';
      bar.innerHTML = `
        <div class="flex items-center gap-3.5">
          <div class="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center flex-shrink-0">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
          </div>
          <div>
            <div class="flex items-center gap-2">
              <span class="text-[10px] font-black uppercase tracking-wider bg-amber-400 text-slate-950 px-2 py-0.5 rounded-full">Registration Prompt</span>
              <span class="text-xs text-slate-300 font-semibold">Official Course Brochures Access</span>
            </div>
            <p class="text-xs text-slate-300 mt-1">
              Registration can prefill your inquiry details. Brochure files are public static assets and are not protected by this browser prompt.
            </p>
          </div>
        </div>
        <div class="flex items-center gap-2 flex-shrink-0 w-full sm:w-auto justify-end">
          <button onclick="openRegistrationModal(null, { isBrochureGate: true })" class="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs rounded-xl shadow-md transition flex items-center gap-2">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"></path></svg>
            <span>Register as Candidate</span>
          </button>
          <button onclick="openQuickUnlockModal()" class="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold text-xs rounded-xl transition">
            Already Registered? Unlock
          </button>
        </div>
      `;
    }
  }

  // 2. Update all download buttons on brochures.html
  const dlButtons = document.querySelectorAll('.brochure-download-btn');
  dlButtons.forEach(btn => {
    const textSpan = btn.querySelector('span');
    if (registered) {
      if (textSpan) textSpan.innerText = 'Download Image';
      btn.title = 'Download official brochure';
    } else {
      if (textSpan) textSpan.innerText = 'Download Image';
      btn.title = 'Open registration prompt before downloading';
    }
  });
}



