import { ChipOption, ChipsField, ImageField, ImageFile, InputField } from '@/components/ui/form';
import { cn } from '@/lib/utils';
import useAppStore from '@/store';
import { CircleUser } from 'lucide-react';
import PhoneNumberField from '../ui/form/phone-number-field';
import { gendersOptions, maritalStatusesOptions, userStatusOptions } from './users-meta';

export function UserForm({ form }: { form: any }) {
    const store = useAppStore();
    return (
        <div className="">
            <div className="flex w-1/4 gap-8">
                <div className="flex justify-center">
                    <ImageField
                        name="image"
                        image={form.values.image}
                        error={store.errors.values.image}
                        onImageChange={(image: ImageFile | undefined) => {
                            form.setValue('image', image);
                        }}
                        id="image"
                        placeholder={
                            <div className="flex items-center justify-center rounded-full">
                                <div>
                                    <CircleUser className="mx-auto h-12 w-12 text-gray-400" />
                                    <p className="mt-2 text-center text-gray-700">Image</p>
                                </div>
                            </div>
                        }
                        className="border-primary-300 block flex h-36 w-36 cursor-pointer items-center justify-center rounded-full border-2 border-dashed bg-gray-200 p-8"
                    />
                </div>
                <div className="mx-auto mt-8 w-[150px]">
                    <ChipsField
                        label="Status"
                        name="status"
                        // optionsClass="block space-y-2"
                        // labelClass="text-center  font-semibold"
                        optionClass="rounded-full justify-center py-1.5 px-8"
                        value={form.values.status}
                        onItemSelected={(option: ChipOption) => {
                            form.setValue('status', option.value);
                        }}
                        options={userStatusOptions}
                        error={store.errors.values.status}
                    />
                </div>
            </div>
            <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2">
                <InputField
                    label="Prénom"
                    name="first_name"
                    value={form.values.first_name}
                    onChange={form.handleChange}
                    error={store.errors.values.first_name}
                />

                <InputField
                    label="Nom de famille"
                    name="last_name"
                    value={form.values.last_name}
                    onChange={form.handleChange}
                    error={store.errors.values.last_name}
                />

                <InputField
                    label="Email"
                    name="email"
                    type="email"
                    value={form.values.email}
                    onChange={form.handleChange}
                    error={store.errors.values.email}
                />

                <div>
                    <label className={cn('mb-1.5 block text-sm font-medium text-gray-900')}>Numero de telephone</label>
                    <PhoneNumberField
                        value={form.values.phone_number}
                        onValueChange={(value: string) => {
                            form.setValue('phone_number', value);
                        }}
                        error={store.errors.values.phone_number}
                    />
                </div>

                <InputField
                    label="Date de naissance"
                    name="birth_date"
                    type="date"
                    value={form.values.birth_date}
                    onChange={form.handleChange}
                    error={store.errors.values.birth_date}
                />

                <ChipsField
                    label="Genre"
                    name="gender"
                    value={form.values.gender}
                    onItemSelected={(option: ChipOption) => {
                        form.setValue('gender', option.value);
                    }}
                    options={gendersOptions}
                    error={store.errors.values.gender}
                />

                <InputField
                    label="Profession"
                    name="profession"
                    value={form.values.profession}
                    onChange={form.handleChange}
                    error={store.errors.values.profession}
                />

                <InputField
                    label="Adresse"
                    name="address"
                    value={form.values.address}
                    onChange={form.handleChange}
                    error={store.errors.values.address}
                />

                <InputField label="Ville" name="city" value={form.values.city} onChange={form.handleChange} error={store.errors.values.city} />

                <InputField
                    label="Date adhesion"
                    name="joined_at"
                    type="date"
                    value={form.values.joined_at}
                    onChange={form.handleChange}
                    error={store.errors.values.joined_at}
                />

                <div className="col-span-2">
                    <ChipsField
                        label="Status matrimonial"
                        name="marital_status"
                        value={form.values.marital_status}
                        onItemSelected={(option: ChipOption) => {
                            form.setValue('marital_status', option.value);
                        }}
                        options={maritalStatusesOptions}
                        error={store.errors.values.marital_status}
                    />
                </div>
            </div>
        </div>
    );
}
