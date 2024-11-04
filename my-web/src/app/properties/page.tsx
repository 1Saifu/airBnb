"use client"

import React, { useEffect, useState } from 'react';
import Navbar from '../../components/layout/Navbar';
import PropertyForm from '../../components/property/propertyForm';
import PropertyEdit from '../../components/property/propertyEdit';
import PropertyCard from '../../components/property/PropertyCard';
import LocalStorageKit from "@/utils/localStorageKit";

const PropertiesPage: React.FC = () => {

    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [selectedProperty, setSelectedProperty] = useState<any | null>(null); 
    const [userId, setUserId] = useState<string | null>(null);
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        const token = LocalStorageKit.get('@library/token');
        const storedUserId = LocalStorageKit.get('@library/userId'); 
        const adminStatus = JSON.parse(LocalStorageKit.get('@library/isAdmin') || 'false');

        setIsAuthenticated(!!token);
        setUserId(storedUserId);
        setIsAdmin(adminStatus); 
        console.log('Retrieved admin status:', adminStatus);
    }, []);

    const handleEdit = (property: any) => {
        setSelectedProperty(property);
        setIsEditing(true); 
    };

    const closeEditModal = () => {
        setSelectedProperty(null); 
        setIsEditing(false);
    };

    return(
        <div>
        <Navbar />
        {isAuthenticated && <PropertyForm />}
        <PropertyCard onEdit={handleEdit} userId={userId} isAdmin={isAdmin} />
            {isEditing && selectedProperty && (
                <PropertyEdit 
                    property={selectedProperty} 
                    onClose={closeEditModal} 
                />
            )}
        </div>
    )
}

export default PropertiesPage;