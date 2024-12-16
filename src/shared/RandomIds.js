import ShortUniqueId from "short-unique-id";

export default class RandomIds {
    static {
        this.uid = new ShortUniqueId({ length: 8 });
    }

    static generateId() {
        return this.uid.rnd();
    }
}
