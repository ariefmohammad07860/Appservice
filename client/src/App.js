import React, { useState } from "react";
import axios from "axios";

const App = () => {
    const [data, setData] = useState([]);

    // Load API URL from environment
    const API_BASE_URL = process.env.REACT_APP_API_URL || window.location.origin;

    const fetchData = async () => {
        try {
            console.log("API Base URL:", API_BASE_URL); // Debugging

            const response = await axios.get(`${API_BASE_URL}/api/tcs`);
            setData(response.data);
            console.log("Fetched Data:", response.data);

        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    return (
        <div>
            <h2>TCS Data</h2>
            <button onClick={fetchData}>Submit</button>
            <table border="1">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>City</th>
                    </tr>
                </thead>
                <tbody>
                    {data.length > 0 ? (
                        data.map((item) => (
                            <tr key={item.id}>
                                <td>{item.id}</td>
                                <td>{item.name}</td>
                                <td>{item.city}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="3">No data available</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default App;
