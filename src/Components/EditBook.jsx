import axios from 'axios';
import React, { useEffect, useState } from 'react'
import Select from 'react-select'
import { backendUrl } from '../constants';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';

export default function EditBook() {
    const [name, setName] = useState(null);
    const [price, setPrice] = useState(null);
    const [selectedAuthors, setSelectedAuthors] = useState([]);
    const [authors, setAuthors] = useState(null);
    const [selectedLiteratures, setSelectedLiteratures] = useState([]);
    const [literatures, setLiteratures] = useState([]);
    const [bookImage, setBookImage] = useState(null);
    const [publishedDate, setPublishedDate] = useState(null);
    const [publisher, setPublisher] = useState(null);
    const [totalAvailability, setTotalAvailability] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalName, setModalName] = useState(null);
    const [modalData, setModalData] = useState(null);
    const locations = useSelector((state) => state.store.locations);
    const [availableLocations, setAvailableLocations] = useState(null);
    const accessToken = useSelector((state) => state.user.token);
    const [isAddButtonDisabled, setIsAddButtonDisabled] = useState(true);
    const [isModalAddButtonDisabled, setIsModalAddButtonDisabled] = useState(true);
    const navigate = useNavigate();
    const { bookId } = useParams();

    function handleAddBook(e) {
        e.preventDefault();
        axios.put(`${backendUrl}/books/edit-book/${bookId}`,
            {
                name,
                publishedDate,
                publisher,
                totalAvailability
            },
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            }
        ).then(() => {
            navigate('/home');
        });
    }

    useEffect(() => {
        const isFormValid = name && publishedDate && totalAvailability && publisher;
        setIsAddButtonDisabled(!isFormValid);
    }, [name, publishedDate, totalAvailability, publisher]);

    useEffect(() => {
        axios.get(`${backendUrl}/books/getById/${bookId}`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        })
            .then((res) => {
                setName(res.data.name);
                setPublisher(res.data.publisher);
                setPublishedDate(res.data.publishedDate);
                setTotalAvailability(res.data.totalAvailability);
            })
    }, [])
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const year = date.getFullYear();
        let month = (date.getMonth() + 1).toString().padStart(2, '0');
        let day = date.getDate().toString().padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    return (
        <div className='flex justify-center items-center h-screen pt-16'>
            <div className='w-96 rounded-lg ring-1 p-9'>
                <h1 className='font-medium text-xl'>Add a New Book here..</h1>
                <form action="" method='POST'>
                    <div>
                        <label htmlFor="name" className="block text-sm float-start font-medium leading-6 text-gray-900">
                            Name
                        </label>
                    </div>
                    <div>
                        <input
                            type="text"
                            name="name"
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        />
                    </div>

                    <div>
                        <label htmlFor="name" className="block text-sm float-start font-medium leading-6 text-gray-900">
                            Publisher
                        </label>
                    </div>
                    <div>
                        <input
                            type="text"
                            name="publisher"
                            id="publisher"
                            value={publisher}
                            onChange={(e) => setPublisher(e.target.value)}
                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        />
                    </div>


                    <div>
                        <label htmlFor="publishedDate" className="block text-sm float-start font-medium leading-6 text-gray-900">
                            Published Date
                        </label>
                    </div>
                    <div>
                        <input
                            type="date"
                            name="publishedDate"
                            id="publishedDate"
                            value={formatDate(publishedDate)} // Extracting the date part
                            onChange={(e) => setPublishedDate(e.target.value)}
                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        />

                    </div>

                    <div className="flex items-center mt-3 gap-2">
                        <label htmlFor="totalAvailability" className="block w-40 text-start text-sm font-medium leading-6 text-gray-900 min-w-max">
                            Total Availability:
                        </label>

                        <input
                            type="number"
                            name="totalAvailability"
                            id="totalAvailability"
                            value={totalAvailability}
                            onChange={(e) => setTotalAvailability(e.target.value)}
                            className="block w-full rounded-lg border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
                    </div>

                    <button
                        type="submit"
                        className="flex w-full justify-center mt-4 rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 disabled:bg-indigo-300 disabled:cursor-not-allowed"
                        onClick={(e) => { handleAddBook(e) }}
                        disabled={isAddButtonDisabled}
                    >
                        Edit Book
                    </button>
                </form>
            </div>
        </div>
    )
}
