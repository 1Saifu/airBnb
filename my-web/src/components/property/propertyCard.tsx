"use client"

import React, { useState, useEffect } from 'react';
import './style/card.css'

const propertyCard: React.FC<{ onEdit: (property: any) => void; userId: string | null; isAdmin: boolean }> = ({ onEdit, userId, isAdmin }) => {
    
    const [properties, setProperties] = useState<any[]>([]);
    const [selectedProperty, setSelectedProperty] = useState<any | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);


    useEffect(() => {
        const token = localStorage.getItem("@library/token");
        setIsAuthenticated(!!token); // Boolean check for authentication
    }, []);
    
    const fetchProperties = async () => {
        try {
            const response = await fetch('/api/properties', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Failed to fetch properties');
            }

            const data = await response.json();
            setProperties(data);
            console.log("Fetched properties:", data); 
        } catch (error) {
            console.error("Error fetching properties:", error);
        }
    };

    useEffect(() => {
        fetchProperties();
    }, []); 

    const handleCardClick = (property: any) => {
        console.log("Property card clicked:", property);
        setSelectedProperty(property);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        console.log("Closing property modal");
        setSelectedProperty(null);
        setIsModalOpen(false);
    };

    const handleDelete = async (propertyId: string, createdById: string) => {
        const confirmed = window.confirm("Are you sure you want to delete this property?");
        if (confirmed) {
            if (isAdmin || createdById === userId) {
                try {
                    const token = localStorage.getItem("token");
                    const response = await fetch(`/api/properties/${propertyId}`, {
                        method: 'DELETE',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`,
                        },
                    });

                    if (response.ok) {
                        setProperties((prev) => prev.filter(property => property.id !== propertyId));
                        closeModal();
                    } else {
                        const error = await response.json();
                        alert(`Error: ${error.message}`);
                    }
                } catch (error) {
                    console.error("Error deleting property:", error);
                }
            } else {
                alert("You are not authorized to delete this property.");
            }
        }
    };
    
    return (
        <div className="property-card-container">
            {properties.length === 0 ? (
                <p>No properties available.</p>
            ) : (
                properties.map((property) => (
                    <div
                        key={property.id}
                        className="property-card"
                        style={{ backgroundImage: `url(${property.imageURL})` }}
                        onClick={() => handleCardClick(property)}
                    >
                        <div className="property-info">
                            <h3 className="property-name">{property.name}</h3>
                            <p className="property-price">${property.pricePerNight} per night</p>
                        </div>
                    </div>
                ))
            )}

            {selectedProperty && (
                <div className="modal" onClick={closeModal}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <span className="close" onClick={closeModal}>&times;</span>
                        <img src={selectedProperty.imageURL} alt={selectedProperty.name} className="modal-image" />
                        <h3>{selectedProperty.name}</h3>
                        <p>{selectedProperty.description}</p>
                        <p>Location: {selectedProperty.location}</p>
                        <p>Price: ${selectedProperty.pricePerNight} per night</p>
                        <p>{selectedProperty.availability ? 'Available' : 'Not Available'}</p>
                        
                        {(isAuthenticated && (isAdmin || selectedProperty.createdById === userId)) && (
                            <>
                                <button
                                    onClick={() => {
                                        onEdit(selectedProperty);
                                        closeModal();
                                    }}
                                    className="edit-button"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => {
                                        handleDelete(selectedProperty.id, selectedProperty.createdById);
                                    }}
                                    className="delete-button"
                                >
                                    Delete
                                </button>
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

export default propertyCard;