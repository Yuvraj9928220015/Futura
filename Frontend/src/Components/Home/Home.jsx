import Banner from "./Banner/Banner"
import Collections from "./Collections/Collections"
import Focus from "./Focus/Focus"
import Categories from './Categories/Categories';
import Sustainability from './Sustainability/Sustainability';
import Certificate from './Certificate/Certificate';
import Testimonial from './testimonial/Testimonial';

export default function Home() {

    return (
        <>
            <Banner />
            <Collections />
            <Categories />
            <Sustainability />
            <Focus />
            <Certificate />
            <Testimonial />
        </>
    )
}
