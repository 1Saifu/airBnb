"use client";

import React, { useState } from 'react';
import axios from 'axios';
import './style/edit.css';
import LocalStorageKit from "@/utils/localStorageKit";

const propertyEdit: React.FC<{ property: any; onClose: () => void }> = ({ property, onClose }) => {

    const [name, setName] = useState(property.name);
    const [description, setDescription] = useState(property.description);
    const [location, setLocation] = useState(property.location);
    const [pricePerNight, setPricePerNight] = useState<string>(property.pricePerNight.toString());
    const [availability, setAvailability] = useState(property.availability);
    const [image, setImage] = useState<File | null>(null);
    const [imageURL, setImageURL] = useState(property.imageURL);


    const pinFileToIPFS = async (file: File): Promise<string> => {
        const url = `https://api.pinata.cloud/pinning/pinFileToIPFS`;
        const formData = new FormData();
        formData.append('file', file);

        const options = {
            headers: {
                pinata_api_key: '5afdcbb74a23edfe5cee', 
                pinata_secret_api_key: '2617db045f96e01f825ca486cfee94891c462cd198612e6f752b945f93d1cc85', 
            },
        };

        try {
            const response = await axios.post(url, formData, options);
            return `https://gateway.pinata.cloud/ipfs/${response.data.IpfsHash}`;
        } catch (error) {
            console.error("Error uploading file to Pinata:", error);
            throw error;
        }
    };


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        let uploadedImageURL = null;
        if (image) {
            try {
                uploadedImageURL = await pinFileToIPFS(image);
                setImageURL(uploadedImageURL);
            } catch (error) {
                alert("Failed to upload image to Pinata.");
                return;
            }
        }
        
        const propertyData = {
            name,
            description,
            location,
            pricePerNight: parseFloat(pricePerNight),
            availability,
            imageURL: uploadedImageURL || imageURL,
            createdById: property.createdById,
        };

        console.log("Updated Property Data:", propertyData); 

        const token = LocalStorageKit.get("@library/token");

        try {
            const response = await fetch(`/api/properties/${property.id}`, {
                method: "PATCH", 
                headers: {
                    "Content-Type": "application/json",
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(propertyData),
            });

            if (response.ok) {
                alert("Property updated successfully!");
                window.location.reload();
                onClose(); 
            } else {
                const error = await response.json();
                alert(`Error: ${error.message}`);
            }
        } catch (error) {
            console.error("Error updating property:", error);
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-75">
            <div className="modal">
                <h2 className="modal-header">Edit Property</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="modal-label">Property Image</label>
                        <input
                            type="file"
                            onChange={(e) => setImage(e.target.files?.[0] || null)}
                            className="modal-input"
                            accept="image/*"
                        />
                    </div>
                    <div>
                        <label className="modal-label">Property Name</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="modal-input"
                            required
                        />
                    </div>
                    <div>
                        <label className="modal-label">Description</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="modal-textarea"
                            required
                        />
                    </div>
                    <div>
                        <label className="modal-label">Location</label>
                        <input
                            type="text"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            className="modal-input"
                            required
                        />
                    </div>
                    <div>
                        <label className="modal-label">Price Per Night</label>
                        <input
                            type="number"
                            value={pricePerNight}
                            onChange={(e) => setPricePerNight(e.target.value)}
                            className="modal-input"
                            required
                        />
                    </div>
                    <div>
                        <label className="modal-label">
                            <input
                                type="checkbox"
                                checked={availability}
                                onChange={(e) => setAvailability(e.target.checked)}
                            />
                            Available
                        </label>
                    </div>
                    <button type="submit" className="button">Update</button>
                    <button 
                        type="button" 
                        onClick={onClose} 
                        className="bg-gray-300 rounded p-2 ml-2"
                    >
                        Cancel
                    </button>
                </form>
            </div>
        </div>
    );
};

export default propertyEdit;