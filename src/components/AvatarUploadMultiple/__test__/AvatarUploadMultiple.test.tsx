import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';

// Components
import AvatarUploadMultiple, { TAvatarUploadMultipleProps } from '../index';

// Constants
import { MESSAGES } from '@/constants';

describe('AvatarUploadMultiple Component', () => {
  const mockOnFileChange = jest.fn();

  const defaultProps: TAvatarUploadMultipleProps = {
    previewFiles: [],
    onFileChange: mockOnFileChange,
  };

  const setup = (props = defaultProps) =>
    render(<AvatarUploadMultiple {...props} />);

  beforeEach(() => {
    global.URL.createObjectURL = jest.fn(
      (file: File) => `/preview-${file.name}`,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders the upload button and no preview images when initialized', () => {
    setup();
    expect(screen.getByText('Upload Image')).toBeInTheDocument();
    expect(screen.queryByRole('img')).not.toBeInTheDocument();
  });

  it('uploads multiple files and displays previews', () => {
    setup();

    const input = screen.getByLabelText('Upload Avatar') as HTMLInputElement;

    const file1 = new File(['content'], 'file1.jpg', { type: 'image/jpeg' });
    const file2 = new File(['content'], 'file2.jpg', { type: 'image/jpeg' });

    fireEvent.change(input, { target: { files: [file1, file2] } });

    expect(screen.getAllByRole('img').length).toBe(2);
    expect(screen.getByAltText('Uploaded image 1')).toHaveAttribute(
      'src',
      'http://localhost/_next/image?url=%2Fpreview-file1.jpg&w=256&q=75',
    );
    expect(screen.getByAltText('Uploaded image 2')).toHaveAttribute(
      'src',
      'http://localhost/_next/image?url=%2Fpreview-file2.jpg&w=256&q=75',
    );
    expect(mockOnFileChange).toHaveBeenCalledWith(
      ['/preview-file1.jpg', '/preview-file2.jpg'],
      [file1, file2],
    );
  });

  it('disables the upload button when two files are already uploaded', () => {
    setup({
      ...defaultProps,
      previewFiles: ['/preview-file1.jpg', '/preview-file2.jpg'],
    });

    const input = screen.getByLabelText('Upload Avatar') as HTMLInputElement;
    expect(input).toBeDisabled();
  });

  it('shows error message when attempting to upload more than two files', () => {
    setup({
      ...defaultProps,
      previewFiles: ['/preview-file1.jpg'],
    });

    const input = screen.getByLabelText('Upload Avatar') as HTMLInputElement;

    const file1 = new File(['content'], 'file1.jpg', { type: 'image/jpeg' });
    const file2 = new File(['content'], 'file2.jpg', { type: 'image/jpeg' });
    const file3 = new File(['content'], 'file3.jpg', { type: 'image/jpeg' });

    fireEvent.change(input, { target: { files: [file1, file2, file3] } });

    expect(screen.getByText(MESSAGES.ERROR.MAX_IMAGE)).toBeInTheDocument();
    expect(mockOnFileChange).not.toHaveBeenCalled();
  });

  it('removes a file preview when delete button is clicked', () => {
    setup({
      ...defaultProps,
      previewFiles: ['/preview-file1.jpg', '/preview-file2.jpg'],
    });

    const deleteButtons = screen.getAllByRole('button', { hidden: true });
    fireEvent.click(deleteButtons[0]);

    expect(mockOnFileChange).toHaveBeenCalledWith(
      ['/preview-file2.jpg'],
      expect.any(Array),
    );
  });

  it('clears input value on click to allow re-uploading the same file', () => {
    setup();

    const input = screen.getByLabelText('Upload Avatar') as HTMLInputElement;

    fireEvent.change(input, {
      target: {
        files: [new File(['content'], 'file.jpg', { type: 'image/jpeg' })],
      },
    });
    expect(input.files?.length).toBe(1);

    fireEvent.click(input);
    expect(input.value).toBe('');
  });

  it('matches the snapshot', () => {
    const { container } = setup();
    expect(container).toMatchSnapshot();
  });
});
