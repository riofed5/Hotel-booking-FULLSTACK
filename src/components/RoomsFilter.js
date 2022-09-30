import React from 'react'
import Title from '../components/Title';

const getUnique = (items, value) => {
    return [...new Set(items.map(item => item[value]))]
}

const RoomsFilter = ({rooms, context}) => {
    const {handleChange, type, price, minPrice, maxPrice, breakfast, pets, capacity, minSize, maxSize} = context;
    let types = ['all', ...getUnique(rooms, 'type')];
    types = types.map((type, index) =>
        (
            <option value={type} key={index}>{type}</option>
        )
    );

    let people = getUnique(rooms, 'capacity');
    people = people.map((item, index) =>
        (
            (<option key={index} value={item}>{item}</option>)
        )
    );

    return (
        <div className="filter-container">
            <Title title="search rooms" />
            <form className=" filter-form">
                {/* Select type */}
                <div className=" form-group">
                    <label htmlFor="type">Room type</label>
                    <select name="type"
                        id="type"
                        value={type}
                        className=" form-control"
                        onChange={handleChange}>
                        {types}
                    </select>
                </div>
                {/* End select type */}
                {/* Guests */}
                <div className=" form-group">
                    <label htmlFor="capacity">Guests</label>
                    <select name="capacity"
                        id="capacity"
                        value={capacity}
                        className="form-control"
                        onChange={handleChange}
                    >
                        {people}
                    </select>
                </div>
                {/* End guests */}
                {/* Price of room*/}
                <div className=" form-group">
                    <label htmlFor="price">room price ${price}</label>
                    <input
                        type="range"
                        name="price"
                        min={minPrice}
                        max={maxPrice}
                        id="price"
                        value={price}
                        onChange={handleChange}
                        className=" form-control"
                    />
                </div>
                {/* End of price*/}
                {/* Size of room*/}
                <div className=" form-group">
                    <label htmlFor="size">room size</label>
                    <div className=" size-inputs">
                        <input
                            type="number"
                            name="minSize"
                            id="size"
                            value={minSize}
                            onChange={handleChange}
                            className=" size-input"
                        />
                        <input
                            type="number"
                            name="maxSize"
                            id="size"
                            value={maxSize}
                            onChange={handleChange}
                            className=" size-input"
                        />
                    </div>

                </div>
                {/* Size of price*/}
                {/* Extras of room*/}
                <div className=" form-group">
                    <div className=" single-extra">
                        <input
                            type="checkbox"
                            name="breakfast"
                            id="breakfast "
                            checked={breakfast}
                            onChange={handleChange}
                        />
                        <label htmlFor="breakfast">breakfast</label>
                    </div>
                    <div className=" single-extra">
                        <input
                            type="checkbox"
                            name="pets"
                            id="pets "
                            checked={pets}
                            onChange={handleChange}
                        />
                        <label htmlFor="pets">pets</label>
                    </div>

                </div>
                {/* Extras of price*/}

            </form>
        </div>
    )

}

export default RoomsFilter
