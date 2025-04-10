const getCountryIsoCode = async (req, res) => {
    const { countryName } = req.params;
    try {
        const headers = new Headers();
        headers.append("X-CSCAPI-KEY", process.env.COUNTRY_STATE_CITY_API_KEY);
        const requestOptions = {
            method: 'GET',
            headers: headers,
            redirect: 'follow',
        };
        const response = await fetch("https://api.countrystatecity.in/v1/countries", requestOptions);
        const resData = await response.json();

        const country = resData.find((element) => element.name === countryName);

        if (country) {
            console.log("isoCode", country.iso2);
            res.status(200).send({ isoCode: country.iso2 });
        } else {
            res.status(404).send({ message: "Country not found" });
        }

    } catch (e) {
        console.log(e);

    }
}

const getStateIsoCode = async (req, res) => {

    //isoCode is iso code of country of which state is to be found
    const { stateName, countryCode } = req.query;
    try {
        const headers = new Headers();
        headers.append("X-CSCAPI-KEY", process.env.COUNTRY_STATE_CITY_API_KEY);
        const requestOptions = {
            method: 'GET',
            headers: headers,
            redirect: 'follow',
        };
        const response = await fetch(`https://api.countrystatecity.in/v1/countries/${countryCode}/states`, requestOptions);
        const resData = await response.json();

        const state = resData.find((element) => element.name === stateName);

        if (state) {
            console.log("isoCode", state.iso2);
            res.status(200).send({ isoCode: state.iso2 });
        } else {
            res.status(404).send({ message: "State not found" });
        }

    } catch (e) {
        console.log(e);

    }
}

module.exports = {
    getCountryIsoCode,getStateIsoCode
};
