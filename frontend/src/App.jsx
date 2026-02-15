import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Detail from './pages/Detail';
import SubDetail from './pages/SubDetail';
import SavedCourse from './pages/SavedCourse';
import CreateCourse from './pages/CreateCourse';
import DeletedMaterials from './pages/DeletedMaterials';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" />;
};

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/create-course"
          element={
            <ProtectedRoute>
              <CreateCourse />
            </ProtectedRoute>
          }
        />
        <Route
          path="/deleted-materials"
          element={
            <ProtectedRoute>
              <DeletedMaterials />
            </ProtectedRoute>
          }
        />
        <Route
          path="/material/:id"
          element={
            <ProtectedRoute>
              <Detail />
            </ProtectedRoute>
          }
        />
        <Route
          path="/material/:id/sub/:subId"
          element={
            <ProtectedRoute>
              <SubDetail />
            </ProtectedRoute>
          }
        />
        <Route
          path="/saved-courses"
          element={
            <ProtectedRoute>
              <SavedCourse />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
