import {
  Navigate,
  Route,
  Routes,
} from 'react-router-dom'

import {
  useAuth,
} from './context/AuthContext'

import ProtectedRoute
  from './routes/ProtectedRoute'

import RoleRedirect
  from './routes/RoleRedirect'

import LoginPage
  from './pages/auth/LoginPage'

import StudentDashboard
  from './pages/student/StudentDashboard'

import ExplorePage
  from './pages/student/ExplorePage'

import ApplicationsPage
  from './pages/student/ApplicationsPage'

import StudentProjectsPage
  from './pages/student/StudentProjectsPage'

import StudentProfilePage
  from './pages/student/StudentProfilePage'

import StudentPortfolioPage
  from './pages/student/StudentPortfolioPage'

import ProjectDetailPage
  from './pages/student/ProjectDetailPage'

import ProjectWorkspacePage
  from './pages/student/ProjectWorkspacePage'

import UmkmDashboard
  from './pages/umkm/UmkmDashboard'

import UmkmProjectsPage
  from './pages/umkm/UmkmProjectsPage'

import UmkmProjectDetailPage
  from './pages/umkm/UmkmProjectDetailPage'

import UmkmProfilePage
  from './pages/umkm/UmkmProfilePage'

import UmkmProjectBuilderPage
  from './pages/umkm/UmkmProjectBuilderPage'

import UmkmApplicantsPage
  from './pages/umkm/UmkmApplicantsPage'

import UmkmProjectWorkspacePage
  from './pages/umkm/UmkmProjectWorkspacePage'

import UmkmFinalReviewPage
  from './pages/umkm/UmkmFinalReviewPage'

import TeacherDashboard
  from './pages/teacher/TeacherDashboard'

import TeacherSubmissionReviewPage
  from './pages/teacher/TeacherSubmissionReviewPage'

import AdminDashboard
  from './pages/admin/AdminDashboard'

import PortfolioVerifyPage
  from './pages/public/PortfolioVerifyPage'


function HomeRedirect() {
  const {
    user,
    loading,
  } = useAuth()


  if (loading) {
    return (
      <div
        className="
          flex
          min-h-screen
          items-center
          justify-center
        "
      >
        <p
          className="
            font-semibold
            text-tumbuh-green-dark
          "
        >
          TUMBUH...
        </p>
      </div>
    )
  }


  if (!user) {
    return (
      <Navigate
        to="/login"
        replace
      />
    )
  }


  return (
    <RoleRedirect
      user={
        user
      }
    />
  )
}


export default function App() {
  return (
    <Routes>

      {/* =========================
          PUBLIC
      ========================= */}

      <Route
        path="/"
        element={
          <HomeRedirect />
        }
      />


      <Route
        path="/login"
        element={
          <LoginPage />
        }
      />


      <Route
        path="/verify"
        element={
          <PortfolioVerifyPage />
        }
      />


      {/* =========================
          SISWA
      ========================= */}

      <Route
        path="/student"
        element={
          <ProtectedRoute
            allowedRoles={[
              'siswa',
            ]}
          >
            <StudentDashboard />
          </ProtectedRoute>
        }
      />


      <Route
        path="/student/explore"
        element={
          <ProtectedRoute
            allowedRoles={[
              'siswa',
            ]}
          >
            <ExplorePage />
          </ProtectedRoute>
        }
      />


      <Route
        path="/student/applications"
        element={
          <ProtectedRoute
            allowedRoles={[
              'siswa',
            ]}
          >
            <ApplicationsPage />
          </ProtectedRoute>
        }
      />


      <Route
        path="/student/projects"
        element={
          <ProtectedRoute
            allowedRoles={[
              'siswa',
            ]}
          >
            <StudentProjectsPage />
          </ProtectedRoute>
        }
      />


      <Route
        path="/student/projects/:projectId"
        element={
          <ProtectedRoute
            allowedRoles={[
              'siswa',
            ]}
          >
            <ProjectDetailPage />
          </ProtectedRoute>
        }
      />


      <Route
        path="/student/projects/:projectId/workspace"
        element={
          <ProtectedRoute
            allowedRoles={[
              'siswa',
            ]}
          >
            <ProjectWorkspacePage />
          </ProtectedRoute>
        }
      />


      <Route
        path="/student/profile"
        element={
          <ProtectedRoute
            allowedRoles={[
              'siswa',
            ]}
          >
            <StudentProfilePage />
          </ProtectedRoute>
        }
      />


      <Route
        path="/student/portfolio"
        element={
          <ProtectedRoute
            allowedRoles={[
              'siswa',
            ]}
          >
            <StudentPortfolioPage />
          </ProtectedRoute>
        }
      />


      {/* =========================
          UMKM
      ========================= */}

      <Route
        path="/umkm"
        element={
          <ProtectedRoute
            allowedRoles={[
              'umkm',
            ]}
          >
            <UmkmDashboard />
          </ProtectedRoute>
        }
      />


      <Route
        path="/umkm/project-builder"
        element={
          <ProtectedRoute
            allowedRoles={[
              'umkm',
            ]}
          >
            <UmkmProjectBuilderPage />
          </ProtectedRoute>
        }
      />


      <Route
        path="/umkm/projects"
        element={
          <ProtectedRoute
            allowedRoles={[
              'umkm',
            ]}
          >
            <UmkmProjectsPage />
          </ProtectedRoute>
        }
      />


      {/*
       * PENTING:
       * Route detail project UMKM.
       *
       * Tombol arrow pada UmkmActiveProjectCard
       * memang mengarah ke route ini.
       */}
      <Route
        path="/umkm/projects/:projectId"
        element={
          <ProtectedRoute
            allowedRoles={[
              'umkm',
            ]}
          >
            <UmkmProjectDetailPage />
          </ProtectedRoute>
        }
      />


      <Route
        path="/umkm/projects/:projectId/applicants"
        element={
          <ProtectedRoute
            allowedRoles={[
              'umkm',
            ]}
          >
            <UmkmApplicantsPage />
          </ProtectedRoute>
        }
      />


      <Route
        path="/umkm/projects/:projectId/workspace"
        element={
          <ProtectedRoute
            allowedRoles={[
              'umkm',
            ]}
          >
            <UmkmProjectWorkspacePage />
          </ProtectedRoute>
        }
      />


      <Route
        path="/umkm/projects/:projectId/review"
        element={
          <ProtectedRoute
            allowedRoles={[
              'umkm',
            ]}
          >
            <UmkmFinalReviewPage />
          </ProtectedRoute>
        }
      />


      <Route
        path="/umkm/profile"
        element={
          <ProtectedRoute
            allowedRoles={[
              'umkm',
            ]}
          >
            <UmkmProfilePage />
          </ProtectedRoute>
        }
      />


      {/* =========================
          GURU
      ========================= */}

      <Route
        path="/teacher"
        element={
          <ProtectedRoute
            allowedRoles={[
              'guru',
            ]}
          >
            <TeacherDashboard />
          </ProtectedRoute>
        }
      />


      <Route
        path="/teacher/submissions/:submissionId"
        element={
          <ProtectedRoute
            allowedRoles={[
              'guru',
            ]}
          >
            <TeacherSubmissionReviewPage />
          </ProtectedRoute>
        }
      />


      {/* =========================
          ADMIN
      ========================= */}

      <Route
        path="/admin"
        element={
          <ProtectedRoute
            allowedRoles={[
              'admin',
            ]}
          >
            <AdminDashboard />
          </ProtectedRoute>
        }
      />


      {/* =========================
          FALLBACK
      ========================= */}

      <Route
        path="*"
        element={
          <Navigate
            to="/"
            replace
          />
        }
      />

    </Routes>
  )
}
