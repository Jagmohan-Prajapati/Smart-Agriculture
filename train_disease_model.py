import os
import tensorflow as tf
from tensorflow.keras.preprocessing.image import ImageDataGenerator
from tensorflow.keras.applications import MobileNetV2
from tensorflow.keras.models import Model
from tensorflow.keras.layers import Dense, GlobalAveragePooling2D
from tensorflow.keras.callbacks import ModelCheckpoint, EarlyStopping

# Paths
train_dir = "image_dataset/train"
test_dir = "image_dataset/test"

# Image Preprocessing
img_size = (224, 224)
batch_size = 32

train_datagen = ImageDataGenerator(
    rescale=1./255,
    rotation_range=20,
    zoom_range=0.2,
    horizontal_flip=True
)

test_datagen = ImageDataGenerator(rescale=1./255)

train_generator = train_datagen.flow_from_directory(
    train_dir,
    target_size=img_size,
    batch_size=batch_size,
    class_mode='categorical'
)

test_generator = test_datagen.flow_from_directory(
    test_dir,
    target_size=img_size,
    batch_size=batch_size,
    class_mode='categorical'
)

# Model Architecture
base_model = MobileNetV2(include_top=False, input_shape=(224, 224, 3), weights='imagenet')
x = base_model.output
x = GlobalAveragePooling2D()(x)
x = Dense(128, activation='relu')(x)
predictions = Dense(train_generator.num_classes, activation='softmax')(x)

model = Model(inputs=base_model.input, outputs=predictions)

# Freeze base layers
for layer in base_model.layers:
    layer.trainable = False

model.compile(optimizer='adam', loss='categorical_crossentropy', metrics=['accuracy'])

# Callbacks
checkpoint = ModelCheckpoint("plant_disease_model.h5", save_best_only=True)
early_stop = EarlyStopping(patience=3, restore_best_weights=True)

# Training
model.fit(
    train_generator,
    validation_data=test_generator,
    epochs=10,
    callbacks=[checkpoint, early_stop]
)

# Save class indices
import json
with open("class_indices.json", "w") as f:
    json.dump(train_generator.class_indices, f)

print("✅ Model trained and saved as plant_disease_model.h5")
