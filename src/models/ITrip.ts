
/**
 * Typebeskriveler av variabler, brukt til localstorage.
 */
interface ITrip {
    img: string;
    id: number;
    title: string;
    description: string;
    location: string;
    likes: number,
    lat: number,
    long: number,
    rating: number;
};

export default ITrip;