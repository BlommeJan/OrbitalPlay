using System;
using System.Collections;
using System.Collections.Generic;
using System.ComponentModel;

namespace FitnessGameLauncher.Helpers
{
    /// <summary>
    /// Base class that implements property change notification and validation support.
    /// </summary>
    public abstract class ValidationBase : INotifyPropertyChanged, INotifyDataErrorInfo
    {
        // Dictionary to hold validation errors
        private readonly Dictionary<string, List<string>> _errors = new Dictionary<string, List<string>>();

        /// <summary>
        /// Gets a value that indicates whether the entity has validation errors.
        /// </summary>
        public bool HasErrors => _errors.Count > 0;

        /// <summary>
        /// Occurs when the validation errors have changed for a property or for the entire entity.
        /// </summary>
        public event EventHandler<DataErrorsChangedEventArgs> ErrorsChanged;

        /// <summary>
        /// Gets the validation errors for a specified property or for the entire entity.
        /// </summary>
        /// <param name="propertyName">The name of the property to retrieve validation errors for; or null or Empty, to retrieve entity-level errors.</param>
        /// <returns>The validation errors for the property or entity.</returns>
        public IEnumerable GetErrors(string propertyName)
        {
            if (string.IsNullOrEmpty(propertyName))
                return null;

            return _errors.ContainsKey(propertyName) ? _errors[propertyName] : null;
        }

        /// <summary>
        /// Raises the ErrorsChanged event for the specified property.
        /// </summary>
        /// <param name="propertyName">The name of the property whose errors changed.</param>
        protected void OnErrorsChanged(string propertyName)
        {
            ErrorsChanged?.Invoke(this, new DataErrorsChangedEventArgs(propertyName));
        }

        /// <summary>
        /// Adds an error message to the specified property.
        /// </summary>
        /// <param name="propertyName">The property name.</param>
        /// <param name="errorMessage">The error message.</param>
        protected void AddError(string propertyName, string errorMessage)
        {
            if (!_errors.ContainsKey(propertyName))
                _errors[propertyName] = new List<string>();

            if (!_errors[propertyName].Contains(errorMessage))
            {
                _errors[propertyName].Add(errorMessage);
                OnErrorsChanged(propertyName);
            }
        }

        /// <summary>
        /// Clears the errors for the specified property.
        /// </summary>
        /// <param name="propertyName">The property name.</param>
        protected void ClearErrors(string propertyName)
        {
            if (_errors.ContainsKey(propertyName))
            {
                _errors.Remove(propertyName);
                OnErrorsChanged(propertyName);
            }
        }

        /// <summary>
        /// Validates the property with the specified name and value.
        /// </summary>
        /// <param name="propertyName">The property name.</param>
        protected virtual void ValidateProperty(string propertyName)
        {
            // Override this method in derived classes to implement property-specific validation
        }

        /// <summary>
        /// Validates all properties.
        /// </summary>
        public void Validate()
        {
            var properties = GetType().GetProperties();
            foreach (var property in properties)
            {
                ValidateProperty(property.Name);
            }
        }

        /// <summary>
        /// Occurs when a property value changes.
        /// </summary>
        public event PropertyChangedEventHandler PropertyChanged;

        /// <summary>
        /// Raises the PropertyChanged event for the specified property, and validates the property.
        /// </summary>
        /// <param name="propertyName">The property name.</param>
        protected virtual void OnPropertyChanged(string propertyName)
        {
            ValidateProperty(propertyName);
            PropertyChanged?.Invoke(this, new PropertyChangedEventArgs(propertyName));
        }
    }
}
