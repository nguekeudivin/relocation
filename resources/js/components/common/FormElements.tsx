import {
    CheckboxesField,
    ChipsField,
    ChipsManyField,
    ImageField,
    ImageFile,
    InputField,
    RadiosField,
    SelectField,
    TextAreaField,
} from '@/components/ui/form';
import { useErrors } from '@/hooks/use-errors';
import { useSimpleForm } from '@/hooks/use-simple-form';

export default function FormElements() {
    const form = useSimpleForm({
        number: '',
        select: '',
        textarea: '',
        checkbox_options: [],
        radio_option: '',
        chip_value: '',
        chips_values: [],
    });

    const errors = useErrors();

    return (
        <div className="space-y-6">
            <InputField
                label="Number"
                type="number"
                name="number"
                value={form.values.number}
                onChange={form.handleChange}
                error={errors.values.number}
            />
            <SelectField
                label="Select Option"
                name="select"
                value={form.values.select}
                onChange={form.handleChange}
                options={[
                    { label: 'Option 1', value: 'option1' },
                    { label: 'Option 2', value: 'option2' },
                ]}
                error={errors.values.type}
            />
            <TextAreaField
                name="textarea"
                value={form.values.textarea}
                onChange={form.handleChange}
                error={errors.values.textarea}
                label={'Textarea'}
            />

            <CheckboxesField
                options={[
                    { label: 'Option 1', value: 'option1', description: 'This is the description of the option 1' },
                    { label: 'Option 2', value: 'option2', description: 'This is the description of the option 2' },
                ]}
                onCheckedChange={function ({ label, value, description }, checked: boolean): void {
                    form.pushToggle('checkbox_options', value, checked);
                }}
                values={form.values.checkbox_options}
            />

            <RadiosField
                options={[
                    { label: 'radio 1', value: 'radio1', description: 'This is the description of the radio 1' },
                    { label: 'radio 2', value: 'radio2', description: 'This is the description of the radio 2' },
                ]}
                onCheckedChange={function ({ label, value, description }, checked: boolean): void {
                    form.setValue('radio_option', value);
                }}
                value={form.values.radio}
            />

            <ChipsField
                onItemSelected={(option: any) => {
                    form.setValue('chip_value', option.value);
                }}
                options={[
                    { label: 'Chip 1', value: 'chip1', description: 'This is the description of the Chip 1' },
                    { label: 'Chip 2', value: 'chip2', description: 'This is the description of the Chip 2' },
                ]}
                value={form.values.chip_value}
            />

            <ChipsManyField
                onItemSelected={(option: any, selected: boolean) => {
                    form.pushToggle('chips_values', option.value, selected);
                }}
                options={[
                    { label: 'Chip 1', value: 'chip1', description: 'This is the description of the Chip 1' },
                    { label: 'Chip 2', value: 'chip2', description: 'This is the description of the Chip 2' },
                ]}
                values={form.values.chips_values}
            />

            <ImageField
                name="image"
                image={form.values.image}
                error={errors.values.image}
                onImageChange={(image: ImageFile | undefined) => {
                    form.setValue('image', image);
                }}
                id={'image'}
                className="border-primary-300 block flex h-48 cursor-pointer items-center justify-center rounded-md border-2 border-dashed bg-gray-200 p-8"
            />
        </div>
    );
}
