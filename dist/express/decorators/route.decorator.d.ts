import { InputProperty, PropertyType, Route } from "../..";
export declare function route<In = any, Out = any>({ name, method, path, auth, required, response, }: Route<In, Out> & {
    name?: string;
}): MethodDecorator;
export declare function getPropertyType(type: InputProperty<any>): PropertyType;
