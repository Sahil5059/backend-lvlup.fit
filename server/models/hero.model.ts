//imports
import { Schema, model, Document } from "mongoose";

//16(a).edit-hero-data
interface IHero extends Document{
    heading: string;
    description: string;
}
const heroSchema = new Schema<IHero>({
    heading: {
        type: String,
    },
    description: {
        type: String,
    },
});
const HeroLayout = model<IHero>('Hero', heroSchema);
export default HeroLayout;
//now, move to hero.ontroller.ts in the "controllers" folder