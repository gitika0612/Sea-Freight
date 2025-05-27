import React, { useState } from "react";
import "../App.css";
import { Card } from "react-bootstrap";
import { ChevronDown, Info, TrashIcon } from "lucide-react";
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import Dropdown from 'react-bootstrap/Dropdown';
import Container3DView from "./Container3DView";

const containerOptions = {
    "20' GP": { maxVolume: 28, maxWeight: 20000 },
    "40' GP": { maxVolume: 56, maxWeight: 26000 },
    "40' HC": { maxVolume: 68, maxWeight: 26000 },
};


const HeroSection = () => {
    const [containerType, setContainerType] = useState("20' GP");
    const [maxVolume, setMaxVolume] = useState(containerOptions["20' GP"].maxVolume);
    const [maxWeight, setMaxWeight] = useState(containerOptions["20' GP"].maxWeight);

    const [rows, setRows] = useState([
        {
            unit: "m",
            length: "",
            width: "",
            height: "",
            grossWeight: "",
            noOfPackages: "1",
            totalWeight: 0,
            packageVolume: 0,
            totalVolume: 0,
        },
    ]);

    const addLine = () => {
        setRows((prev) => [
            ...prev,
            {
                unit: "m",
                length: "",
                width: "",
                height: "",
                grossWeight: "",
                noOfPackages: "1",
                totalWeight: 0,
                packageVolume: 0,
                totalVolume: 0,
            },
        ]);
    };

    const handleContainerChange = (type) => {
        setContainerType(type);
        setMaxVolume(containerOptions[type].maxVolume);
        setMaxWeight(containerOptions[type].maxWeight);
    };

    const handleChange = (index, field, value) => {
        const newRows = [...rows];
        const row = { ...newRows[index], [field]: value };

        const length = parseFloat(row.length) || 0;
        const width = parseFloat(row.width) || 0;
        const height = parseFloat(row.height) || 0;
        const grossWeight = parseFloat(row.grossWeight) || 0;
        const noOfPackages = parseInt(row.noOfPackages) || 0;

        // Convert all dimensions to meters
        let lengthInMeters = length;
        let widthInMeters = width;
        let heightInMeters = height;

        switch (row.unit) {
            case "cm":
                lengthInMeters = length / 100;
                widthInMeters = width / 100;
                heightInMeters = height / 100;
                break;
            case "mm":
                lengthInMeters = length / 1000;
                widthInMeters = width / 1000;
                heightInMeters = height / 1000;
                break;
            default:
                break;
        }

        const packageVolume = parseFloat((lengthInMeters * widthInMeters * heightInMeters).toFixed(3));
        const totalVolume = parseFloat((packageVolume * noOfPackages).toFixed(3));
        const totalWeight = parseFloat((grossWeight * noOfPackages).toFixed(2));

        newRows[index] = {
            ...row,
            packageVolume,
            totalVolume,
            totalWeight,
        };

        setRows(newRows);
    };

    const totalPackages = rows.reduce((sum, row) => sum + (parseInt(row.noOfPackages) || 0), 0);
    const totalWeight = rows.reduce((sum, row) => sum + (parseFloat(row.totalWeight) || 0), 0).toFixed(2);
    const totalPackageVolume = rows.reduce((sum, row) => sum + (parseFloat(row.packageVolume) || 0), 0).toFixed(3);
    const totalVolume = rows.reduce((sum, row) => sum + (parseFloat(row.totalVolume) || 0), 0).toFixed(3);

    const suggestContainer = () => {
        const totalVol = parseFloat(totalVolume);
        const totalWt = parseFloat(totalWeight);

        const suggestion = Object.entries(containerOptions).find(
            ([, c]) => totalVol <= c.maxVolume && totalWt <= c.maxWeight
        );

        return suggestion ? suggestion[0] : "Exceeds all standard containers";
    };

    const packageList = rows.flatMap((row) => {
        const count = parseInt(row.noOfPackages) || 0;

        let lengthInMeters = parseFloat(row.length);
        let widthInMeters = parseFloat(row.width);
        let heightInMeters = parseFloat(row.height);

        if (row.unit === "cm") {
            lengthInMeters /= 100;
            widthInMeters /= 100;
            heightInMeters /= 100;
        } else if (row.unit === "mm") {
            lengthInMeters /= 1000;
            widthInMeters /= 1000;
            heightInMeters /= 1000;
        }

        return Array.from({ length: count }, () => {
            if (
                !lengthInMeters || !widthInMeters || !heightInMeters ||
                lengthInMeters <= 0 || widthInMeters <= 0 || heightInMeters <= 0
            ) return null;

            return {
                length: lengthInMeters,
                width: widthInMeters,
                height: heightInMeters,
                weight: parseFloat(row.grossWeight),
                unit: row.unit
            };
        }).filter(Boolean);

    });

    const RATE_PER_UNIT = 100;

    const weightInTons = totalWeight / 1000;
    const chargeableWeight = Math.max(weightInTons, totalVolume);
    const estimatedCost = (chargeableWeight * RATE_PER_UNIT).toFixed(2);


    return (
        <div className="hero-section py-3 px-5">
            <div>
                <h1 className="color fw-bold heading-title">
                    CBM Calculator for <span className="text-color"> SeaFreight </span> Shipping
                </h1>

                <p className="mt-3 color paragraph-text">
                    Quickly calculate CBM and load containers with ease and precision.
                </p>


                {/* first card  */}
                <div className="pt-4 d-flex justify-content-center">
                    <Card className="fulLWidth px-2 py-3">
                        <div className="d-flex flex-column flex-md-row align-items-center justify-content-center gap-5">
                            <div>
                                <div className="d-flex gap-1 align-items-center justify-content-center">
                                    <div className="fw-semibold">Container Type</div>
                                    <OverlayTrigger
                                        placement="top"
                                        delay={{ show: 250, hide: 400 }}
                                        overlay={
                                            <Tooltip id="button-tooltip">
                                                Select a shipping container type to set the max volumne and weight.
                                            </Tooltip>
                                        }
                                    >
                                        <span className="cursor-pointer"><Info size={16} /></span>
                                    </OverlayTrigger>
                                </div>
                                <div className="mt-2">
                                    <Dropdown className="custom-dropdown">
                                        <Dropdown.Toggle className="custom-dropdown-toggle d-flex justify-content-between align-items-center">
                                            {containerType}
                                            <ChevronDown height={20} />
                                        </Dropdown.Toggle>
                                        <Dropdown.Menu className="custom-dropdown-menu">
                                            {Object.keys(containerOptions).map((type) => (
                                                <Dropdown.Item key={type} onClick={() => handleContainerChange(type)}>
                                                    {type}
                                                </Dropdown.Item>
                                            ))}
                                        </Dropdown.Menu>
                                    </Dropdown>
                                </div>
                            </div>
                            <div>
                                <div className="d-flex gap-1 align-items-center justify-content-center">
                                    <div className="fw-semibold"> Maximum loading volume</div>
                                    <OverlayTrigger
                                        placement="top"
                                        overlay={<Tooltip>CBM capacity of the container.</Tooltip>}
                                    >
                                        <span className="cursor-pointer"><Info size={16} /></span>
                                    </OverlayTrigger>
                                </div>
                                <div className="input-with-unit mt-2">
                                    <input
                                        type="text"
                                        className="custom-dropdown padding"
                                        placeholder="Volume"
                                        value={maxVolume}
                                        onChange={(e) => setMaxVolume(e.target.value)}
                                    />

                                    <span className="input-unit">m³</span>
                                </div>

                            </div>
                            <div>
                                <div className="d-flex gap-1 align-items-center justify-content-center">
                                    <div className="fw-semibold">Maximum loading weight</div>
                                    <OverlayTrigger
                                        placement="top"
                                        overlay={<Tooltip>Maximum allowable weight in kg.</Tooltip>}
                                    >
                                        <span className="cursor-pointer"><Info size={16} /></span>
                                    </OverlayTrigger>
                                </div>
                                <div className="input-with-unit mt-2">
                                    <input
                                        type="text"
                                        className="custom-dropdown padding"
                                        placeholder="Weight"
                                        value={maxWeight}
                                        onChange={(e) => setMaxWeight(e.target.value)}
                                    />
                                    <span className="input-unit">kg</span>
                                </div>

                            </div>
                        </div>
                    </Card>
                </div>

                {/* second card */}
                <div className="pt-4">
                    {/* Table-style card */}
                    <Card className="px-3 py-3">
                        {/* Header Row */}
                        <div className="row fw-semibold mb-3 d-none d-md-flex">
                            <div className="col">Unit of measure</div>
                            <div className="col">Length</div>
                            <div className="col">Width</div>
                            <div className="col">Height</div>
                            <div className="col">Gross weight</div>
                            <div className="col">No. of packages</div>
                            <div className="col">Total weight</div>
                            <div className="col">Package volume</div>
                            <div className="col">Total volume</div>
                            {rows.length > 1 && <div className="col">Action</div>}
                        </div>

                        {/* Input Rows */}
                        {rows.map((row, index) => (
                            <div
                                key={index}
                                className={`row align-items-center flex-column flex-md-row pb-3 ${rows.length > 1 ? "mb-3 border-bottom border-md-0" : ""
                                    }`}

                            >
                                {/* Unit */}
                                <div className="col-12 col-md">
                                    <div className="d-md-none fw-semibold mb-1">Unit of measure</div>
                                    <Dropdown className="custom-dropdown-2 w-100">
                                        <Dropdown.Toggle className="custom-dropdown-toggle d-flex justify-content-between align-items-center w-100">
                                            {row.unit || "Select"} <ChevronDown height={20} />
                                        </Dropdown.Toggle>

                                        <Dropdown.Menu className="custom-dropdown-menu">
                                            {["m", "cm", "mm"].map((unitOption) => (
                                                <Dropdown.Item
                                                    key={unitOption}
                                                    onClick={() => handleChange(index, "unit", unitOption)}
                                                >
                                                    {unitOption}
                                                </Dropdown.Item>
                                            ))}
                                        </Dropdown.Menu>
                                    </Dropdown>
                                </div>

                                {/* Length */}
                                <div className="col-12 col-md mt-3 mt-md-0">
                                    <div className="d-md-none fw-semibold mb-1">Length</div>
                                    <input
                                        type="number"
                                        className="form-control"
                                        placeholder="0"
                                        value={row.length}
                                        onChange={(e) => handleChange(index, "length", e.target.value)}
                                    />
                                </div>

                                {/* Width */}
                                <div className="col-12 col-md mt-3 mt-md-0">
                                    <div className="d-md-none fw-semibold mb-1">Width</div>
                                    <input
                                        type="number"
                                        className="form-control"
                                        placeholder="0"
                                        value={row.width}
                                        onChange={(e) => handleChange(index, "width", e.target.value)}
                                    />
                                </div>

                                {/* Height */}
                                <div className="col-12 col-md mt-3 mt-md-0">
                                    <div className="d-md-none fw-semibold mb-1">Height</div>
                                    <input
                                        type="number"
                                        className="form-control"
                                        placeholder="0"
                                        value={row.height}
                                        onChange={(e) => handleChange(index, "height", e.target.value)}
                                    />
                                </div>

                                {/* Gross Weight */}
                                <div className="col-12 col-md mt-3 mt-md-0">
                                    <div className="d-md-none fw-semibold mb-1">Gross weight</div>
                                    <input
                                        type="number"
                                        className="form-control"
                                        placeholder="0"
                                        value={row.grossWeight}
                                        onChange={(e) => handleChange(index, "grossWeight", e.target.value)}
                                    />
                                </div>

                                {/* No. of packages */}
                                <div className="col-12 col-md mt-3 mt-md-0">
                                    <div className="d-md-none fw-semibold mb-1">No. of packages</div>
                                    <input
                                        type="number"
                                        className="form-control"
                                        placeholder="1"
                                        min="1"
                                        value={row.noOfPackages}
                                        onChange={(e) => handleChange(index, "noOfPackages", e.target.value)}
                                    />
                                </div>

                                {/* Total weight */}
                                <div className="col-12 col-md mt-3 mt-md-0">
                                    <div className="d-md-none fw-semibold mb-1">Total weight</div>
                                    <div>{row.totalWeight} Kg</div>
                                </div>

                                {/* Package volume */}
                                <div className="col-12 col-md mt-3 mt-md-0">
                                    <div className="d-md-none fw-semibold mb-1">Package volume</div>
                                    <div>{row.packageVolume} m³</div>
                                </div>

                                {/* Total volume */}
                                <div className="col-12 col-md mt-3 mt-md-0">
                                    <div className="d-md-none fw-semibold mb-1">Total volume</div>
                                    <div>{row.totalVolume} m³</div>
                                </div>

                                {/* Action */}
                                {rows.length > 1 && (
                                    <div className="col-12 col-md mt-3 mt-md-0">
                                        <div className="d-md-none fw-semibold mb-1">Action</div>
                                        <TrashIcon
                                            onClick={() => {
                                                const newRows = [...rows];
                                                newRows.splice(index, 1);
                                                setRows(newRows);
                                            }}
                                            height={15}
                                            className="cursor-pointer"
                                        />
                                    </div>
                                )}
                            </div>
                        ))}

                        {/* Totals row */}
                        <div
                            className={`row fw-bold pt-2 flex-column flex-md-row ${rows.length === 1 ? "border-top" : ""
                                }`}
                        >                            <div className="col-12 col-md">
                                <button
                                    className="btn"
                                    style={{ padding: "5px 15px", fontWeight: "600" }}
                                    onClick={addLine}
                                >
                                    Add Line
                                </button>
                            </div>
                            <div className="col-12 col-md mt-3 mt-md-0 d-none d-md-block"></div>
                            <div className="col-12 col-md mt-3 mt-md-0 d-none d-md-block"></div>
                            <div className="col-12 col-md mt-3 mt-md-0 d-none d-md-block"></div>
                            <div className="col-12 col-md mt-3 mt-md-0 d-none d-md-block">Totals</div>
                            <div className="col-12 col-md mt-3 mt-md-0 d-none d-md-block">{totalPackages}</div>
                            <div className="col-12 col-md mt-3 mt-md-0 d-none d-md-block">{totalWeight} Kg</div>
                            <div className="col-12 col-md mt-3 mt-md-0 d-none d-md-block">{totalPackageVolume} m³</div>
                            <div className="col-12 col-md mt-3 mt-md-0 d-none d-md-block">{totalVolume} m³</div>

                        </div>
                    </Card>
                </div>


                {/* third card  */}
                <div className="pt-4 d-flex flex-column flex-md-row justify-content-between gap-3 mb-3">
                    <div className="responsive-half" >
                        <Card className="px-4 py-4 " >
                            <h5 className="fw-bold mb-4">Cargo Summary</h5>

                            {/* Weight Section */}
                            <div className="mb-3">
                                <div className="d-flex justify-content-between mb-1">
                                    <div className="fw-semibold">Total Cargo Weight</div>
                                    <div>{totalWeight} / {maxWeight} Kg</div>
                                </div>
                                <div className="progress" style={{ height: "12px" }}>
                                    <div
                                        className={`progress-bar ${(totalWeight / maxWeight) * 100 > 100 ? "bg-danger" : "bg-success"
                                            }`}
                                        role="progressbar"
                                        style={{
                                            width: `${Math.min((totalWeight / maxWeight) * 100, 100)}%`,
                                        }}
                                        aria-valuenow={(totalWeight / maxWeight) * 100}
                                        aria-valuemin="0"
                                        aria-valuemax="100"
                                    ></div>
                                </div>
                            </div>

                            {/* Volume Section */}
                            <div>
                                <div className="d-flex justify-content-between mb-1">
                                    <div className="fw-semibold">Total Cargo Volume</div>
                                    <div>{totalVolume} / {maxVolume} m³</div>
                                </div>
                                <div className="progress" style={{ height: "12px" }}>
                                    <div
                                        className={`progress-bar ${(totalVolume / maxVolume) * 100 > 100 ? "bg-danger" : "bg-success"
                                            }`}
                                        role="progressbar"
                                        style={{
                                            width: `${Math.min((totalVolume / maxVolume) * 100, 100)}%`,
                                        }}
                                        aria-valuenow={(totalVolume / maxVolume) * 100}
                                        aria-valuemin="0"
                                        aria-valuemax="100"
                                    ></div>
                                </div>
                            </div>

                            <div className="mt-4">
                                <h5 className="fw-bold mb-3">Estimated Shipping Cost</h5>
                                <div className="d-flex justify-content-between">
                                    <div className="fw-semibold">Chargeable Weight (CBM or Tons)</div>
                                    <div>{chargeableWeight} (unit)</div>
                                </div>
                                <div className="d-flex justify-content-between mt-2">
                                    <div className="fw-semibold">Estimated Cost</div>
                                    <div>${estimatedCost}</div>
                                </div>
                            </div>
                        </Card>
                        <Card className="mt-3 px-4 py-3 d-flex flex-column justify-content-center align-items-center" style={{ height: '12.2rem' }}>
                            <h5 className="fw-bold">Suggested Container</h5>
                            <div className="mt-2">
                                <span className="text-color fs-5">
                                    {suggestContainer() || 'No suggestion available'}
                                </span>
                            </div>
                        </Card>
                    </div>
                    <div className="responsive-half">
                        <Card className="px-4 py-3" style={{ height: '32.7rem' }}>
                            <h5 className="fw-bold mb-3">Container View</h5>
                            {packageList && packageList.length > 0 ? (
                                <Container3DView packageList={packageList} containerType={containerType} />
                            ) : (
                                <div style={{ height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', color: '#999' }}>
                                    No container data to display
                                </div>
                            )}
                        </Card>
                    </div>

                </div>

            </div>
        </div>
    );
};

export default HeroSection;
